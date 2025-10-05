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
 * 1b) Text + Optional User Image → feedback + style keywords (8 styles) with intelligent context
 */
export function promptFromTextWithUserContext(userText: string, opts: { styleCount: number }) {
  const count = Math.max(1, Math.min(10, opts.styleCount || 8));
  const keys = Array.from({ length: count }, (_, i) => `    "style_${i + 1}": "string - style keyword"`).join(',\n');

  return `
You are a professional fashion stylist and trend forecaster.

CONTEXT:
- The user may have uploaded a photo showing their current outfit (if image is provided)
- The user's request is: "${userText}"

Your goal:
1. IF AN IMAGE IS PROVIDED:
   - Analyze what the user is currently wearing (style, colors, fit, aesthetic, gender presentation)
   - Determine if their text request is RELEVANT to their current outfit:
     * RELEVANT: Queries like "what goes with this?", "suggest shoes for this", "help me accessorize", "improve this look"
     * NOT DIRECTLY RELEVANT: Queries like "beach vacation outfits", "winter styles", "business casual looks" (general requests)
   - If relevant: Reference their outfit in feedback and suggest complementary styles
   - If not directly relevant: Use outfit as a hint for their general style preference, but focus on answering their specific request

2. IF NO IMAGE IS PROVIDED:
   - Respond to their text request with general style guidance

3. Generate style keywords that match:
   - Their specific request (primary priority)
   - Their current style aesthetic if relevant (secondary context)
   - Their apparent gender presentation if visible

Return STRICT JSON ONLY in the following format:
{
  "feedback": "2-4 short, helpful sentences. If their query relates to their current outfit and image is provided, acknowledge what they're wearing. Otherwise, focus on their request with general style guidance.",
  "style_keywords": {
${keys}
  }
}

### RULES:
- Output exactly ${count} keyword entries (style_keywords.style_1 … style_${count}).
- Each keyword value must be a concise style search term (1-4 words max).
- Keywords should primarily address the user's TEXT REQUEST
- If image is relevant to the query, let it inform gender/aesthetic direction
- Examples: "minimal streetwear men", "business casual women", "athleisure", "summer casual", "beach vacation style"
- Be intelligent about when to reference the outfit vs when to focus purely on their question
- No markdown, no commentary, no backticks.
- Return only the pure JSON object.
`.trim();
}

/**
 * 2) Image → garments only (up to 10)
 */
export function promptFromImageForKeywords(opts: { garmentCount: number }) {
  const count = Math.max(1, Math.min(10, opts.garmentCount || 10));
  const keys = Array.from({ length: count }, (_, i) => `  "garment_${i + 1}": "string in format 'description type gender (men or women)'"`).join(',\n');

  return `
You are a professional fashion stylist and visual trend analyst.
Carefully examine the provided outfit image and perform the following tasks:

1. Identify the subject's gender from the image (choose "men" or "women". DO NOT choose unisex).
2. Determine the outfit's dominant *fashion style or aesthetic* (e.g., minimal, streetwear, business casual, vintage, athleisure, bohemian).
3. Identify the *primary and secondary color palette* visible in the clothing.
4. Infer the *style identity and mood* created by the combination of garments, silhouettes, and colors.

Based on this full analysis, output STRICT JSON ONLY with ${count} garments that match and complement the *same overall style, color palette,* and *gender presentation*, as if curating cohesive items to recreate the look.

Return JSON in **exactly** this format:
{
${keys}
}

### RULES:
- Each garment must align with the *identified style category*, *color harmony*, and *gender presentation* inferred from the image.
- Each value must follow this format: "color description type gender"
  (examples: "cream oversized hoodie men", "olive chinos men", "light wash denim jacket women").
- Include a color adjective that accurately reflects the outfit’s palette (e.g., beige, charcoal, pastel blue, sage green).
- Focus strictly on *clothing items* (tops, bottoms, outerwear, dresses, shoes).
  Do **not** include accessories, bags, hats, or jewelry.
- Ensure garment diversity (not all tops or all shoes unless visually appropriate).
- Return **only the JSON object** — no explanations, markdown, or commentary.
- Avoid repeating color–type combinations unless essential to maintain the outfit’s cohesion.
- Prioritize garments that preserve both *style identity* and *color cohesion* of the original outfit.
`.trim();
}

/**
 * 3) Style reference → score + feedback + garment suggestions (4 garments)
 */
export function promptForGarmentSuggestions(styleReference: string) {
  return `
You are a professional fashion stylist and outfit curator.
The user has selected a style reference/aesthetic keyword: "${styleReference}"

Your task:
1. Evaluate how well-defined and actionable this style reference is for creating a cohesive outfit (score 1-10).
2. Provide helpful feedback in 3 bullet points that guide the user on how to style this look, including:
   - Key characteristics of this style
   - Color palette recommendations
   - Styling tips or outfit combinations
3. Suggest 4 specific garment items that would work perfectly for this style.

Return STRICT JSON ONLY in the following format:
{
  "score": "number 1-10 as string",
  "feedback": {
    "bullet_point_1": {
      "summary": "Brief heading (3-5 words)",
      "detail": "Detailed explanation (1-2 sentences)"
    },
    "bullet_point_2": {
      "summary": "Brief heading (3-5 words)",
      "detail": "Detailed explanation (1-2 sentences)"
    },
    "bullet_point_3": {
      "summary": "Brief heading (3-5 words)",
      "detail": "Detailed explanation (1-2 sentences)"
    }
  },
  "ai_script": "A conversational 2-3 sentence voice script that an AI stylist would say to introduce this style and garment suggestions to the user",
  "garment_suggestion": {
    "garment_1": "color description type gender (men or women)) (e.g., 'navy slim-fit blazer men')",
    "garment_2": "color description type gender (men or women)",
    "garment_3": "color description type gender (men or women)",
    "garment_4": "color description type gender (men or women)"
  }
}

### RULES:
- Score should reflect how clear and actionable the style reference is.
- Each garment must fit the style reference's aesthetic and color palette.
- Garments should work together as a cohesive outfit.
- Use format: "color description type gender" for each garment.
- Include diverse garment types (top, bottom, outerwear, shoes).
- No markdown, no commentary, no backticks.
- Return only the pure JSON object.
`.trim();
}