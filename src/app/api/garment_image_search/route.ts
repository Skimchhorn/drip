import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { getGoogleSearchKey, getGarmentSearchId } from "@/lib/key-rotation";

// Initialize Upstash Redis client (free alternative to Vercel KV)
const kv = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CACHE_TTL = 3600; // 1 hour

/**
 * Garment Image Search API with KV Caching + Key Rotation
 *
 * Searches for garment images using Google Custom Search API with a direct keyword.
 * This endpoint is used after receiving keywords from Gemini (gemini_keywords_from_image or gemini_keywords_from_text).
 * Uses Vercel KV caching and API key rotation to prevent rate limits.
 *
 * REQUEST:
 *   Method: GET
 *   Query Parameters:
 *     - keyword (required): Garment search keyword (e.g., "blue denim jacket men", "white t-shirt women")
 *     - num (optional): Number of image results to return (default: "4")
 *
 * RESPONSE:
 *   Success (200):
 *   {
 *     "keyword": "blue denim jacket men",
 *     "total": 4,
 *     "images": [...],
 *     "cached": true/false
 *   }
 *
 *   Error (400):
 *   {
 *     "error": "Missing keyword"
 *   }
 */
export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get("keyword");
  if (!keyword) return NextResponse.json({ error: "Missing keyword" }, { status: 400 });

  const num = req.nextUrl.searchParams.get("num") ?? "4";

  // Create cache key
  const cacheKey = `garment_image:${keyword}:${num}`;

  // Check KV cache first
  try {
    const cached = await kv.get(cacheKey);
    if (cached) {
      console.log(`[KV Cache HIT] ${cacheKey}`);
      return NextResponse.json({ ...cached, cached: true });
    }
    console.log(`[KV Cache MISS] ${cacheKey}`);
  } catch (kvError) {
    console.warn('[KV Get Error]', kvError);
    // Continue without cache
  }

  // Use rotated keys
  const googleKey = getGoogleSearchKey();
  const garmentId = getGarmentSearchId();

  const params = new URLSearchParams({
    key: googleKey,
    cx: garmentId,
    q: keyword,
    searchType: "image",
    num,
    start: "1",
    safe: "active"
  });

  try {
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);
    const json = await response.json();

    if (!response.ok) return NextResponse.json({ error: json }, { status: response.status });

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
      keyword,
      total: images.length,
      images
    };

    // Cache the response
    try {
      await kv.set(cacheKey, responseData, { ex: CACHE_TTL });
      console.log(`[KV Cache SET] ${cacheKey} (TTL: ${CACHE_TTL}s)`);
    } catch (kvError) {
      console.warn('[KV Set Error]', kvError);
      // Continue without caching
    }

    return NextResponse.json({ ...responseData, cached: false });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Garment image search failed', details: String(err?.message || err) },
      { status: 500 }
    );
  }
}
