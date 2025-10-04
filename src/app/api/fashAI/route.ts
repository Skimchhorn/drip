import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';
import open from 'open';

// === CONFIG ===
const FASHN_API_KEY = process.env.FASHN_API_KEY!
const IMGBB_API_KEY = process.env.IMGBB_API_KEY!
const MODEL_IMAGE_PATH = "Images/caiden.jpeg";
const GARMENT_IMAGE_PATH = "Images/dress.jpg";
const BASE_URL = "https://api.fashn.ai/v1";

// === Type Definitions ===
type ImgBBResponse = {
  data: {
    url: string;
  };
};

type FashnJobResponse = {
  id: string;
  error?: any;
};

type FashnStatusResponse = {
  id: string;
  status: "pending" | "completed" | "failed";
  output?: string[];
  error?: {
    name: string;
    message: string;
  };
};

// === Upload image to ImgBB ===
async function uploadToImgBB(imagePath: string): Promise<string | null> {
  const form = new FormData();
  form.append("key", IMGBB_API_KEY);
  form.append("image", fs.createReadStream(imagePath));

  try {
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: form,
    });

    const data = (await response.json()) as ImgBBResponse;

    if (response.ok && data.data?.url) {
      console.log(`✅ Uploaded ${imagePath} to ImgBB: ${data.data.url}`);
      return data.data.url;
    } else {
      console.error(`❌ Failed to upload ${imagePath}:`, data);
      return null;
    }
  } catch (error) {
    console.error(`❌ Upload error for ${imagePath}:`, error);
    return null;
  }
}

// === Run Try-On Flow ===
async function runTryOn() {
  const modelUrl = await uploadToImgBB(MODEL_IMAGE_PATH);
  const garmentUrl = await uploadToImgBB(GARMENT_IMAGE_PATH);

  if (!modelUrl || !garmentUrl) {
    console.error("❌ Could not upload one or both images.");
    return;
  }

  const payload = {
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

  try {
    const res = await fetch(`${BASE_URL}/run`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const jobData = (await res.json()) as FashnJobResponse;

    if (!res.ok || !jobData.id) {
      console.error("❌ Failed to start try-on job:", jobData);
      return;
    }

    const jobId = jobData.id;
    console.log(`⏳ Job submitted! ID: ${jobId}`);

    // === Poll for status
    while (true) {
      const statusRes = await fetch(`${BASE_URL}/status/${jobId}`, { headers });
      const statusData = (await statusRes.json()) as FashnStatusResponse;

      const status = statusData.status;
      console.log(`Status: ${status}`);

      if (status === "completed") {
        const output = statusData.output;
        if (Array.isArray(output) && output.length > 0) {
          const outputUrl = output[0];
          console.log("✅ Output image:", outputUrl);
          await open(outputUrl);
        } else {
          console.warn("⚠️ Output malformed or missing.");
        }
        break;
      } else if (status === "failed") {
        console.error("❌ Job failed. Error:", statusData.error);
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3s
    }
  } catch (err) {
    console.error("❌ Unexpected error during try-on process:", err);
  }
}

// === Start ===
runTryOn();