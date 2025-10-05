// src/app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs'; // Ensure Node runtime (not Edge)
export const dynamic = 'force-dynamic';

/**
 * Gemini Style Analysis API
 *
 * Analyzes a style image and provides fashion feedback with garment suggestions.
 *
 * REQUEST:
 *   Method: POST
 *   Headers:
 *     Content-Type: application/json
 *   Body:
 *   {
 *     "image_url": "https://example.com/image.jpg"
 *   }
 *
 * RESPONSE:
 *   Success (200):
 *   {
 *     "score": "75",
 *     "feedback": {
 *       "bullet_point_1": {
 *         "summary": "Great color coordination",
 *         "detail": "The color palette works well together. The neutral tones create a cohesive look."
 *       },
 *       "bullet_point_2": {
 *         "summary": "Good fit overall",
 *         "detail": "The garments appear to fit well. Consider tailoring for a more refined silhouette."
 *       },
 *       "bullet_point_3": {
 *         "summary": "Modern style aesthetic",
 *         "detail": "The outfit follows current trends effectively. Consider adding statement pieces."
 *       },
 *       "ai_script": "Your outfit scores a 75! The color coordination is excellent..."
 *     },
 *     "garment_suggestion": {
 *       "garment_1": "white t-shirt men",
 *       "garment_2": "dark wash jeans men",
 *       "garment_3": "casual sneakers men",
 *       "garment_4": "denim jacket men"
 *     }
 *   }
 *
 *   Error (400):
 *   {
 *     "error": "Missing required field",
 *     "details": "image_url is required in the request body"
 *   }
 *
 *   Error (400):
 *   {
 *     "error": "Invalid URL",
 *     "details": "Please provide a valid image URL"
 *   }
 *
 *   Error (500):
 *   {
 *     "error": "Analysis failed",
 *     "details": "Error message"
 *   }
 */

// ===============================
// TYPE DEFINITIONS
// ===============================

interface StyleAnalysisRequest {
  image_url: string;
}

interface BulletPoint {
  summary: string;
  detail: string;
}

interface Feedback {
  bullet_point_1: BulletPoint;
  bullet_point_2: BulletPoint;
  bullet_point_3: BulletPoint;
  ai_script: string;
}

interface GarmentSuggestion {
  garment_1: string;
  garment_2: string;
  garment_3: string;
  garment_4: string;
}

interface StyleAnalysisResponse {
  score: string;
  feedback: Feedback;
  garment_suggestion: GarmentSuggestion;
}

// ===============================
// GEMINI ANALYZER CLASS (GenAI SDK)
// ===============================

class GeminiStyleAnalyzer {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('GOOGLE_API_KEY is required');
    this.ai = new GoogleGenAI({ apiKey });
  }

  private getPrompt(): string {
    return `You are a fashion expert AI. Your task is to analyze the person's outfit in the provided image and return a style assessment as a single, raw JSON object.

Your response **must** be a single JSON object and nothing else. Do not use markdown, backticks, or any explanatory text.

---

### JSON Structure

Return a JSON object with this exact structure. Note the required format for \`garment_suggestion\`.

\`\`\`json
{
  "score": "string (0-99)",
  "feedback": {
    "bullet_point_1": {
      "summary": "string (4-7 words)",
      "detail": "string (3-4 sentences)"
    },
    "bullet_point_2": {
      "summary": "string (4-7 words)",
      "detail": "string (3-4 sentences)"
    },
    "bullet_point_3": {
      "summary": "string (4-7 words)",
      "detail": "string (3-4 sentences)"
    },
    "ai_script": "string (conversational summary for text-to-speech)"
  },
  "garment_suggestion": {
    "garment_1": "string in format 'description type gender', e.g. 'white t-shirt men'",
    "garment_2": "string in format 'description type gender', e.g. 'dark wash jeans women'",
    "garment_3": "string in format 'description type gender'",
    "garment_4": "string in format 'description type gender'"
  }
}
\`\`\`

---

### Rules & Guidelines

#### **Garment Suggestions**
* The \`garment_suggestion\` values **must** be articles of clothing only (e.g., shirts, pants, jackets, sweaters, shoes, dresses).
* You **must not** suggest accessories of any kind (e.g., hats, bags, sunglasses, watches, jewelry, belts, caps).
* Each suggestion must follow the exact format: \`'description type gender'\`. The gender must be either \`men\` or \`women\`.

#### **Scoring Guidelines**
* **0-30:** Poor styling
* **31-50:** Below average
* **51-70:** Average
* **71-85:** Good styling
* **86-99:** Excellent styling

#### **Feedback Style**
* Provide constructive, encouraging feedback focusing on what works and what could improve.
* Ensure all string length and sentence count rules are followed precisely.`;
  }

  async analyzeStyle(imageBase64: string, mimeType: string): Promise<{ parsed: StyleAnalysisResponse; rawText: string }> {
    const result = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: imageBase64,
          },
        },
        { text: this.getPrompt() },
      ],
      // IMPORTANT: use generationConfig (not "config")
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      },
    });

    // Some SDK versions expose text directly; keep compatibility.
    const text = (result as any).text ?? (result as any).response?.text?.() ?? '';
    const textValue = typeof text === 'function' ? await text() : text;

    if (!textValue || typeof textValue !== 'string') {
      throw new Error('Gemini returned an empty response; possibly blocked by safety filters.');
    }

    // Guard: strip accidental markdown fences if present
    const cleaned = textValue.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed: StyleAnalysisResponse;
    try {
      parsed = JSON.parse(cleaned) as StyleAnalysisResponse;
    } catch (e) {
      // Surface helpful debugging information
      throw new Error(`Failed to parse JSON from model. First 300 chars: ${cleaned.slice(0, 300)}`);
    }

    const scoreNum = parseInt(parsed.score, 10);
    if (Number.isNaN(scoreNum) || scoreNum < 0 || scoreNum > 99) {
      throw new Error(`Invalid score: ${parsed.score}. Must be 0-99 as a string.`);
    }
    return { parsed, rawText: cleaned };
  }
}

// ===============================
// HELPERS
// ===============================

async function fetchImageAsBase64(imageUrl: string): Promise<{ data: string; mimeType: string }> {
  const resp = await fetch(imageUrl);
  if (!resp.ok) throw new Error(`Failed to fetch image: ${resp.status} ${resp.statusText}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  const mimeType = resp.headers.get('content-type') || 'image/jpeg';
  return { data: buf.toString('base64'), mimeType };
}

async function analyzeWithRetry(
  analyzer: GeminiStyleAnalyzer,
  imageData: { data: string; mimeType: string },
  maxRetries = 2
): Promise<StyleAnalysisResponse> {
  let lastErr: any = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const fullResponse = await analyzer.analyzeStyle(imageData.data, imageData.mimeType);
      return fullResponse.parsed;
    } catch (e: any) {
      lastErr = e;
      console.error(`Attempt ${attempt} failed. Full error:`, e?.message || e);
      if (attempt < maxRetries) await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
  throw new Error(`Analysis failed after ${maxRetries} attempts: ${lastErr?.message}`);
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// ===============================
// API ROUTE HANDLERS
// ===============================

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    const { image_url } = (await req.json()) as StyleAnalysisRequest;

    if (!image_url) {
      return NextResponse.json(
        { error: 'Missing required field', details: 'image_url is required in the request body' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Validate URL
    try {
      new URL(image_url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL', details: 'Please provide a valid image URL' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const analyzer = new GeminiStyleAnalyzer(process.env.GOOGLE_API_KEY as string);
    const imageData = await fetchImageAsBase64(image_url);
    const result = await analyzeWithRetry(analyzer, imageData);

    return NextResponse.json(result, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Analysis failed', details: String(err?.message || err) },
      { status: 500, headers: corsHeaders() }
    );
  }
}