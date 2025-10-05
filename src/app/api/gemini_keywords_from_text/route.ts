// src/app/api/keywords-from-text/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGemini, promptFromText, promptFromTextWithUserContext, fetchImageAsBase64, corsHeaders } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

/**
 * Generates fashion style keywords from a text description using Gemini AI.
 * Optionally accepts user's outfit image URL for personalized, context-aware suggestions.
 *
 * @param {NextRequest} req - The Next.js request object
 * @param {string} req.body.text - Text description of desired fashion style
 * @param {string} [req.body.userImageUrl] - Optional URL of user's current outfit photo
 *
 * @returns {NextResponse} JSON response
 * @returns {Object} response.body - Parsed JSON object
 * @returns {string} response.body.feedback - AI feedback on the input text
 * @returns {Object} response.body.style_keywords - Object containing style keyword variations
 * @returns {string} response.body.style_keywords.style_1 - Style keyword variation 1
 * @returns {string} response.body.style_keywords.style_N - Style keyword variation N (up to 8)
 *
 * @example
 * POST /api/gemini_keywords_from_text
 * Body: { "text": "what shoes go with this?", "userImageUrl": "data:image/..." }
 * Response: { "feedback": "Based on your outfit...", "style_keywords": { "style_1": "...", ... } }
 *
 * @throws {400} Missing text parameter or processing error
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text;
    const userImageUrl = body.userImageUrl;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "text" field in request body' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const ai = getGemini();

    // Check if user image is provided
    const hasUserImage = userImageUrl && typeof userImageUrl === 'string' && userImageUrl.trim().length > 0;

    // Use context-aware prompt if image is provided, otherwise use text-only prompt
    const prompt = hasUserImage
      ? promptFromTextWithUserContext(text, { styleCount: 8 })
      : promptFromText(text, { styleCount: 8 });

    let payload: any;

    if (hasUserImage) {
      // Image + Text request - fetch and encode the user's outfit image
      const imageData = await fetchImageAsBase64(userImageUrl);

      payload = {
        model: 'gemini-2.5-flash',
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: imageData.mimeType,
                  data: imageData.data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
          topP: 0.9,
          maxOutputTokens: 512,
        },
        config: { thinkingConfig: { thinkingBudget: 0 } },
      };
    } else {
      // Text-only request
      payload = {
        model: 'gemini-2.5-flash',
        contents: [{ text: prompt }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
          topP: 0.9,
          maxOutputTokens: 512,
        },
        config: { thinkingConfig: { thinkingBudget: 0 } },
      };
    }

    const result = await (ai as any).models.generateContent(payload);

    const raw = (result as any).text ?? (result as any).response?.text?.();
    const textOut = typeof raw === 'function' ? await raw() : raw;
    const cleaned = String(textOut || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // Expect shape:
    // { "feedback": string, "style_keywords": { style_1: "...", ... style_8: "..." } }
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'keywords-from-text failed', details: String(err?.message || err) },
      { status: 400, headers: corsHeaders() },
    );
  }
}
