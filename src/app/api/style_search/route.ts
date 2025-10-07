import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { mockGalleryImages } from "@/lib/mockData";
import { getGoogleSearchKey, getStyleSearchId } from "@/lib/key-rotation";

// Initialize Upstash Redis client (free alternative to Vercel KV)
const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

/**
 * Style Search API with Upstash Redis Caching + API Key Rotation
 *
 * Searches for style images using Google Custom Search API with STYLE_SEARCH_ID.
 * Uses Upstash Redis as a caching layer to prevent rate limits and reduce API calls.
 * Rotates between multiple API keys to distribute load and avoid per-key rate limits.
 *
 * REQUEST:
 *   Method: GET
 *   Query Parameters:
 *     - q (required): Search query string (e.g., "casual summer mens outfits")
 *     - num (optional): Number of results to return (default: "10")
 *     - start (optional): Starting index for results (default: "1")
 *     - imgSize (optional): Image size filter (e.g., "medium", "large")
 *     - imgType (optional): Image type filter (e.g., "photo", "clipart")
 *     - safe (optional): Safe search setting (default: "active")
 *     - rights (optional): Usage rights filter
 *     - fileType (optional): File type filter (e.g., "jpg", "png")
 *
 * RESPONSE:
 *   Success (200):
 *   {
 *     "query": "casual summer mens outfits",
 *     "total": 10,
 *     "nextStart": 11,
 *     "images": [...],
 *     "cached": true/false
 *   }
 *
 *   Error (400):
 *   {
 *     "error": "Missing q"
 *   }
 */

const CACHE_TTL = 3600; // 1 hour
const MAX_RETRIES = 2;
const BASE_DELAY = 500; // ms

// Sleep utility for retry logic
async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Exponential backoff with jitter
function getRetryDelay(attempt: number): number {
  return BASE_DELAY * Math.pow(2, attempt) + Math.floor(Math.random() * 1000);
}

// Transform mock data to match API response format
function transformMockDataToApiResponse(query: string, num: string, start: string) {
  const numResults = parseInt(num, 10);
  const startIndex = parseInt(start, 10);
  const slicedMocks = mockGalleryImages.slice(startIndex - 1, startIndex - 1 + numResults);
  
  return {
    query,
    total: slicedMocks.length,
    nextStart: startIndex + numResults <= mockGalleryImages.length ? startIndex + numResults : null,
    images: slicedMocks.map(mock => ({
      title: mock.title,
      url: mock.imageUrl,
      thumb: mock.imageUrl,
      pageUrl: mock.imageUrl,
      width: 1080,
      height: 1080,
      mime: "image/jpeg"
    })),
    fallback: true
  };
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 });

  const num = req.nextUrl.searchParams.get("num") ?? "10";
  const start = req.nextUrl.searchParams.get("start") ?? "1";
  const imgSize = req.nextUrl.searchParams.get("imgSize") ?? undefined;
  const imgType = req.nextUrl.searchParams.get("imgType") ?? undefined;
  const safe = req.nextUrl.searchParams.get("safe") ?? "active";
  const rights = req.nextUrl.searchParams.get("rights") ?? undefined;
  const fileType = req.nextUrl.searchParams.get("fileType") ?? undefined;

  // Create cache key from query parameters
  const cacheKey = `style_search:${q}:${num}:${start}:${imgSize}:${imgType}:${safe}:${rights}:${fileType}`;

  try {
    // Check cache first
    const cached = await kv.get(cacheKey);
    if (cached) {
      console.log(`[KV Cache HIT] ${cacheKey}`);
      return NextResponse.json({ ...cached, cached: true });
    }
    console.log(`[KV Cache MISS] ${cacheKey}`);

    // Build API request parameters with rotated keys
    const googleKey = getGoogleSearchKey();
    const styleId = getStyleSearchId();
    
    const params = new URLSearchParams({
      key: googleKey,
      cx: styleId,
      q,
      searchType: "image",
      num,
      start,
      safe
    });
    if (imgSize) params.set("imgSize", imgSize);
    if (imgType) params.set("imgType", imgType);
    if (rights) params.set("rights", rights);
    if (fileType) params.set("fileType", fileType);

    // Retry logic with exponential backoff
    let lastError: any = null;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const r = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`, {
          signal: controller.signal
        });
        clearTimeout(timeout);

        const json = await r.json();

        // Handle rate limiting (429)
        if (r.status === 429) {
          console.warn(`[API Rate Limited] Attempt ${attempt + 1}/${MAX_RETRIES + 1}`);
          
          // Check if we have a cached version (even expired)
          const staleCache = await kv.get(cacheKey);
          if (staleCache) {
            console.log(`[Serving stale cache] ${cacheKey}`);
            return NextResponse.json({ ...staleCache, cached: true, stale: true });
          }

          // If no cache and last attempt, fallback to mock data
          if (attempt === MAX_RETRIES) {
            console.log(`[Fallback to mock data] ${cacheKey}`);
            const mockResponse = transformMockDataToApiResponse(q, num, start);
            return NextResponse.json(mockResponse);
          }

          // Wait before retry (respect Retry-After header if present)
          const retryAfter = r.headers.get("Retry-After");
          const delay = retryAfter 
            ? parseInt(retryAfter, 10) * 1000 
            : getRetryDelay(attempt);
          
          console.log(`[Retrying in ${delay}ms]`);
          await sleep(delay);
          continue;
        }

        // Handle other errors
        if (!r.ok) {
          console.error(`[API Error] ${r.status}:`, json);
          
          // For non-rate-limit errors, try cache or mock
          const staleCache = await kv.get(cacheKey);
          if (staleCache) {
            return NextResponse.json({ ...staleCache, cached: true, stale: true });
          }
          
          // Last resort: return mock data
          if (attempt === MAX_RETRIES) {
            const mockResponse = transformMockDataToApiResponse(q, num, start);
            return NextResponse.json(mockResponse);
          }
          
          lastError = { error: json, status: r.status };
          await sleep(getRetryDelay(attempt));
          continue;
        }

        // Success! Transform and cache the response
        const images = (json.items ?? []).map((it: any) => ({
          title: it.title,
          url: it.link,
          thumb: it.image?.thumbnailLink ?? null,
          pageUrl: it.image?.contextLink ?? null,
          width: it.image?.width ?? null,
          height: it.image?.height ?? null,
          mime: it.mime ?? it.image?.mime ?? null
        }));

        const responseData = {
          query: q,
          total: images.length,
          nextStart: json.queries?.nextPage?.[0]?.startIndex ?? null,
          images
        };

        // Store in KV cache
        try {
          await kv.set(cacheKey, responseData, { ex: CACHE_TTL });
          console.log(`[KV Cache SET] ${cacheKey} (TTL: ${CACHE_TTL}s)`);
        } catch (kvError) {
          console.error("[KV Set Error]", kvError);
          // Don't fail the request if caching fails
        }

        return NextResponse.json({ ...responseData, cached: false });

      } catch (fetchError: any) {
        console.error(`[Fetch Error] Attempt ${attempt + 1}/${MAX_RETRIES + 1}:`, fetchError.message);
        lastError = fetchError;
        
        if (attempt < MAX_RETRIES) {
          await sleep(getRetryDelay(attempt));
          continue;
        }
      }
    }

    // All retries exhausted - try cache or mock
    const staleCache = await kv.get(cacheKey);
    if (staleCache) {
      console.log(`[Serving stale cache after retries] ${cacheKey}`);
      return NextResponse.json({ ...staleCache, cached: true, stale: true });
    }

    // Final fallback: mock data
    console.log(`[Final fallback to mock data] ${cacheKey}`);
    const mockResponse = transformMockDataToApiResponse(q, num, start);
    return NextResponse.json(mockResponse);

  } catch (error: any) {
    console.error("[Unexpected Error]", error);
    
    // Try to serve cached data even on unexpected errors
    try {
      const staleCache = await kv.get(cacheKey);
      if (staleCache) {
        return NextResponse.json({ ...staleCache, cached: true, stale: true });
      }
    } catch (kvError) {
      console.error("[KV Get Error in catch]", kvError);
    }

    // Ultimate fallback: mock data
    const mockResponse = transformMockDataToApiResponse(q, num, start);
    return NextResponse.json(mockResponse);
  }
}
