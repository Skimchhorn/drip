import { NextRequest, NextResponse } from "next/server";
import { getGemini, promptForGarmentSuggestions, corsHeaders } from "@/lib/gemini";
import { requireQueryParam } from "@/lib/api-utils";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

/**
 * Garment Search API
 *
 * Takes a style reference, calls Gemini API to get garment suggestions,
 * then searches for each garment using Google Custom Search API.
 *
 * REQUEST:
 *   Method: GET
 *   Query Parameters:
 *     - styleReference (required): Style reference/aesthetic keyword (e.g., "minimal streetwear", "business casual")
 *     - num (optional): Number of product results per garment (default: "10")
 *
 * RESPONSE:
 *   Success (200):
 *   {
 *     "score": "8",
 *     "feedback": {
 *       "bullet_point_1": { "summary": "...", "detail": "..." },
 *       "bullet_point_2": { "summary": "...", "detail": "..." },
 *       "bullet_point_3": { "summary": "...", "detail": "..." }
 *     },
 *     "ai_script": "...",
 *     "garment_suggestion": {
 *       "garment_1": "navy slim-fit blazer men",
 *       "garment_2": "white oxford shirt men",
 *       "garment_3": "charcoal dress pants men",
 *       "garment_4": "brown leather oxford shoes men"
 *     },
 *     "garment_results": {
 *       "garment_1": [
 *         {
 *           "title": "Image title",
 *           "url": "https://example.com/image.jpg",
 *           "thumb": "https://example.com/thumb.jpg",
 *           "pageUrl": "https://example.com/page",
 *           "width": 1920,
 *           "height": 1080,
 *           "mime": "image/jpeg"
 *         }
 *       ],
 *       "garment_2": [...],
 *       "garment_3": [...],
 *       "garment_4": [...]
 *     }
 *   }
 *
 *   Error (400):
 *   {
 *     "error": "Error message"
 *   }
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    console.log('API received URL:', req.url);
    console.log('Query params:', Object.fromEntries(url.searchParams));
    const styleReference = requireQueryParam(url, 'styleReference');
    const num = url.searchParams.get("num") ?? "10";

    // Step 1: Call Gemini API with style reference
    const ai = getGemini();
    const prompt = promptForGarmentSuggestions(styleReference);

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: prompt }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
      config: { thinkingConfig: { thinkingBudget: 0 } },
    });

    const raw = (result as any).text ?? (result as any).response?.text?.();
    const textOut = typeof raw === 'function' ? await raw() : raw;
    const cleaned = String(textOut || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    const geminiResponse = JSON.parse(cleaned);

    // Step 2: Iterate through garment suggestions and call Google Search API
    const garmentSuggestions = geminiResponse.garment_suggestion;
    const garmentResults: Record<string, any[]> = {};

    for (const [key, garmentName] of Object.entries(garmentSuggestions)) {
      if (typeof garmentName !== 'string') continue;

      // Construct search query: styleReference + garmentName
      const searchQuery = `${styleReference} ${garmentName}`;

      // Call Google Custom Search API
      const params = new URLSearchParams({
        key: process.env.GOOGLE_SEARCH_API_KEY!,
        cx: process.env.GARMENT_SEARCH_ID!,
        q: searchQuery,
        searchType: "image",
        num,
        start: "1",
        safe: "active"
      });

      const searchResponse = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);
      const searchJson = await searchResponse.json();

      if (!searchResponse.ok) {
        garmentResults[key] = [];
        continue;
      }

      // Format the images
      const images = (searchJson.items ?? []).map((it: any) => ({
        title: it.title,
        url: it.link,
        thumb: it.image?.thumbnailLink ?? null,
        pageUrl: it.image?.contextLink ?? null,
        width: it.image?.width ?? null,
        height: it.image?.height ?? null,
        mime: it.mime ?? it.image?.mime ?? null
      }));

      garmentResults[key] = images;
    }

    // Step 3: Format and return the complete response
    return NextResponse.json({
      score: geminiResponse.score,
      feedback: geminiResponse.feedback,
      ai_script: geminiResponse.ai_script,
      garment_suggestion: geminiResponse.garment_suggestion,
      garment_results: garmentResults
    }, { headers: corsHeaders() });

  } catch (err: any) {
    return NextResponse.json(
      { error: 'Garment search failed', details: String(err?.message || err) },
      { status: 400, headers: corsHeaders() }
    );
  }
}
