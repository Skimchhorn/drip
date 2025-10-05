import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Garment Image Search API
 *
 * Searches for garment images using Google Custom Search API with a direct keyword.
 * This endpoint is used after receiving keywords from Gemini (gemini_keywords_from_image or gemini_keywords_from_text).
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
 *     "images": [
 *       {
 *         "title": "Image title",
 *         "url": "https://example.com/image.jpg",
 *         "thumb": "https://example.com/thumb.jpg",
 *         "pageUrl": "https://example.com/page",
 *         "width": 1920,
 *         "height": 1080,
 *         "mime": "image/jpeg"
 *       }
 *     ]
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

  const params = new URLSearchParams({
    key: process.env.GOOGLE_SEARCH_API_KEY!,
    cx: process.env.GARMENT_SEARCH_ID!,
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

    return NextResponse.json({
      keyword,
      total: images.length,
      images
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Garment image search failed', details: String(err?.message || err) },
      { status: 500 }
    );
  }
}
