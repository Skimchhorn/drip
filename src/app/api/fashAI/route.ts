import { NextRequest, NextResponse } from "next/server";

const FASHN_API_KEY = process.env.FASHN_API_KEY!;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY!;
const BASE_URL = "https://api.fashn.ai/v1";

type ImgBBResponse = {
  data: { url: string };
};

type FashnJobResponse = {
  id: string;
  error?: any;
};

type FashnStatusResponse = {
  id: string;
  status: "pending" | "completed" | "failed";
  output?: string[];
  error?: { name: string; message: string };
};

async function uploadToImgBB(fileBase64: string): Promise<string | null> {
  // Remove data:image/png;base64, prefix if present
  const base64Data = fileBase64.includes(',')
    ? fileBase64.split(',')[1]
    : fileBase64;

  const form = new URLSearchParams();
  form.append("key", IMGBB_API_KEY);
  form.append("image", base64Data);

  console.log('Uploading to ImgBB, base64 length:', base64Data.length);

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: form,
  });

  const data = (await res.json()) as ImgBBResponse;
  console.log('ImgBB response:', data);

  if (!data.data?.url) {
    console.error('ImgBB upload failed:', data);
  }

  return data.data?.url || null;
}

/**
 * Virtual try-on API using Fashn.ai to overlay a garment image onto a model image.
 *
 * @param {NextRequest} req - The Next.js request object
 * @param {string} req.body.modelImage - Base64-encoded image of the model (with or without data URI prefix)
 * @param {string} req.body.garmentImage - Base64-encoded image of the garment (with or without data URI prefix)
 *
 * @returns {NextResponse} JSON response
 * @returns {string} response.body.output - URL of the generated try-on result image
 *
 * @example
 * POST /api/fashAI
 * Body: { "modelImage": "data:image/png;base64,...", "garmentImage": "data:image/png;base64,..." }
 * Response: { "output": "https://result-image-url.com/image.png" }
 *
 * @throws {400} Missing modelImage or garmentImage
 * @throws {500} Upload failed, job creation failed, or job execution failed
 * @throws {504} Job timeout (exceeded 30 seconds)
 */
export async function POST(req: NextRequest) {
  const { modelImage, garmentImage } = await req.json();

  if (!modelImage || !garmentImage) {
    return NextResponse.json({ error: "Missing images" }, { status: 400 });
  }

  try {
    const modelUrl = await uploadToImgBB(modelImage);
    const garmentUrl = await uploadToImgBB(garmentImage);

    if (!modelUrl || !garmentUrl) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const jobPayload = {
      model_name: "tryon-v1.6",
      inputs: {
        model_image: modelUrl,
        garment_image: garmentUrl,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FASHN_API_KEY}`,
    };

    const jobRes = await fetch(`${BASE_URL}/run`, {
      method: "POST",
      headers,
      body: JSON.stringify(jobPayload),
    });

    const jobData = (await jobRes.json()) as FashnJobResponse;

    if (!jobRes.ok || !jobData.id) {
      return NextResponse.json({ error: "Job failed", detail: jobData }, { status: 500 });
    }

    const jobId = jobData.id;

    // Polling loop (max 30s timeout)
    const maxTries = 10;
    for (let i = 0; i < maxTries; i++) {
      const statusRes = await fetch(`${BASE_URL}/status/${jobId}`, { headers });
      const statusData = (await statusRes.json()) as FashnStatusResponse;

      if (statusData.status === "completed") {
        return NextResponse.json({ output: statusData.output?.[0] });
      } else if (statusData.status === "failed") {
        return NextResponse.json({ error: "Job failed", detail: statusData.error }, { status: 500 });
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    return NextResponse.json({ error: "Timeout: Job not completed in time" }, { status: 504 });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error", detail: String(err) }, { status: 500 });
  }
}