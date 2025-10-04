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
  const form = new URLSearchParams();
  form.append("key", IMGBB_API_KEY);
  form.append("image", fileBase64);

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: form,
  });

  const data = (await res.json()) as ImgBBResponse;
  return data.data?.url || null;
}

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