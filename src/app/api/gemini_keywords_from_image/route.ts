// src/app/api/keywords-from-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGemini, promptFromImageForKeywords, fetchImageAsBase64, corsHeaders } from '@/lib/gemini';
import { requireQueryParam, isValidUrl } from '@/lib/api-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const imgURL = requireQueryParam(url, 'imgURL');
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