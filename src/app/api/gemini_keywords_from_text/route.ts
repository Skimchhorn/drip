// src/app/api/keywords-from-text/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGemini, promptFromText, corsHeaders } from '@/lib/gemini';
import { requireQueryParam } from '@/lib/api-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const text = requireQueryParam(url, 'text');

    const ai = getGemini();
    const prompt = promptFromText(text, { styleCount: 8 });

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: prompt }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 512,
      },
      config: { thinkingConfig: { thinkingBudget: 0 } },
    });

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