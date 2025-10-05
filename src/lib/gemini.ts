// src/lib/gemini.ts
import { GoogleGenAI } from '@google/genai';

export function getGemini() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new Error('GOOGLE_API_KEY is required');
  return new GoogleGenAI({ apiKey: key });
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function fetchImageAsBase64(imageUrl: string): Promise<{ data: string; mimeType: string }> {
  const resp = await fetch(imageUrl);
  if (!resp.ok) throw new Error(`Failed to fetch image: ${resp.status} ${resp.statusText}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  const mimeType = resp.headers.get('content-type') || 'image/jpeg';
  return { data: buf.toString('base64'), mimeType };
}

/**
 * 1) Text → feedback + style keywords (8 styles)
 */
export function promptFromText(userText: string, opts: { styleCount: number }) {
  const count = Math.max(1, Math.min(10, opts.styleCount || 8));
  // build keys style_1..style_N
  const keys = Array.from({ length: count }, (_, i) => `    "style_${i + 1}": "string - style keyword"`).join(',\n');

  return `
You are a professional fashion stylist and trend forecaster.
Analyze the user's natural-language input describing their desired clothing style or aesthetic.

Your goal:
1. Understand the user's intent — what kind of *look*, *mood*, *season*, and *style direction* they want (e.g., "casual summer outfits" → relaxed, breathable, warm-weather tones).
2. Translate that intent into *fashion guidance* and *specific style search keywords* aligned with the user's description.

INPUT_TEXT:
${userText}

Return STRICT JSON ONLY in the following format:
{
  "feedback": "2-4 short, helpful sentences describing what kind of style or aesthetic fits the user's intent, including tone (e.g., relaxed, edgy, refined) and general color or fabric suggestions.",
  "style_keywords": {
${keys}
  }
}

### RULES:
- Output exactly ${count} keyword entries (style_keywords.style_1 … style_${count}).
- Each keyword value must be a concise style search term (1-4 words max).
- Examples: "minimal streetwear", "business casual", "vintage bohemian", "athleisure", "summer casual", "dark academia"
- Keywords should capture the *aesthetic*, *mood*, *season*, or *occasion* from the user's input.
- No markdown, no commentary, no backticks.
- Return only the pure JSON object.
- Provide diverse but related style keywords that all fit the user's overall intent.
`.trim();
}

/**
 * 2) Image → garments only (up to 10)
 */
export function promptFromImageForKeywords(opts: { garmentCount: number }) {
  const count = Math.max(1, Math.min(10, opts.garmentCount || 10));
  const keys = Array.from({ length: count }, (_, i) => `  "garment_${i + 1}": "string in format 'description type gender'"`).join(',\n');

  return `
You are a professional fashion stylist and visual trend analyst. 
Carefully examine the provided outfit image and perform the following tasks:

1. Identify the outfit’s dominant *fashion style or aesthetic* (e.g., minimal, streetwear, business casual, vintage, athleisure, bohemian).
2. Determine the *primary and secondary color palette* visible in the clothing.
3. Infer the *style identity and mood* created by the combination of garments, silhouettes, and colors.

Based on this full analysis, output STRICT JSON ONLY with ${count} garments that match and complement the *same overall style and color palette*, as if curating cohesive items to recreate the look.

Return JSON in **exactly** this format:
{
${keys}
}

### RULES:
- Each garment must fit the same *style category* and *color harmony* as the outfit in the image.
- Each value must follow this format: "color description type gender" 
  (examples: "cream oversized hoodie men", "olive chinos men", "light wash denim jacket women").
- Include a color adjective that accurately reflects the outfit’s palette (e.g., beige, charcoal, pastel blue, sage green).
- Focus only on *clothing items* (tops, bottoms, outerwear, dresses, shoes). 
  Do **not** include accessories, bags, hats, or jewelry.
- Ensure garment diversity (not all tops or all shoes unless visually appropriate).
- No markdown, commentary, or natural language — return the **pure JSON object** only.
- Avoid repeating color–type combinations unless stylistically necessary.
- Prioritize garments that preserve both the *style identity* and *color cohesion* of the original outfit.
`.trim();
}