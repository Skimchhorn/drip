// src/app/api/keywords-from-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGemini, promptFromImageForKeywords, fetchImageAsBase64, corsHeaders } from '@/lib/gemini';
import { isValidUrl } from '@/lib/api-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

/**
 * Extracts fashion keywords from a garment image using Gemini AI.
 *
 * @param {NextRequest} req - The Next.js request object
 * @param {string} req.body.imgURL - URL of the garment image to analyze
 *
 * @returns {NextResponse} JSON response
 * @returns {Object} response.body - Parsed JSON object containing garment keywords
 * @returns {string} response.body.garment_1 - Keywords for garment 1
 * @returns {string} response.body.garment_2 - Keywords for garment 2
 * @returns {string} response.body.garment_N - Keywords for garment N (up to 10)
 *
 * @example
 * POST /api/gemini_keywords_from_image
 * Body: { "imgURL": "https://example.com/image.jpg" }
 * Response: { "garment_1": "blue denim jacket casual", "garment_2": "...", ... }
 *
 * @throws {400} Invalid URL or processing error
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const imgURL = body.imgURL;

    if (!imgURL || typeof imgURL !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "imgURL" field in request body' },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (!isValidUrl(imgURL)) {
      return NextResponse.json({ error: 'Invalid URL', details: 'Provide a valid imgURL' }, { status: 400, headers: corsHeaders() });
    }

    const { data, mimeType } = await fetchImageAsBase64(imgURL);
    const ai = getGemini();
    const prompt = promptFromImageForKeywords({ garmentCount: 10 });

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { inlineData: { mimeType, data } },
        { text: prompt },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 256,
      },
      config: { thinkingConfig: { thinkingBudget: 0 } },
    });

    const raw = (result as any).text ?? (result as any).response?.text?.();
    const textOut = typeof raw === 'function' ? await raw() : raw;
    const cleaned = String(textOut || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // Expect shape:
    // { "garment_1": "...", "garment_2": "...", ..., "garment_10": "..." }
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'keywords-from-image failed', details: String(err?.message || err) },
      { status: 400, headers: corsHeaders() },
    );
  }
}