#!/usr/bin/env node
// scripts/fetch-pexels-mock.js
// Usage: PEXELS_API_KEY=your_key node scripts/fetch-pexels-mock.js
// This script queries the Pexels API for portrait fashion images, validates each image URL
// with a HEAD request, and writes a verified list of 100 images to src/lib/mockGalleryImages.ts

const fs = require('fs').promises;
const path = require('path');

// Node 18+ has global fetch; if not available, the user should run this with Node 18+ or install node-fetch
const fetchFn = global.fetch || require('node-fetch');

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error('Missing PEXELS_API_KEY environment variable. Get an API key from https://www.pexels.com/api/');
  process.exit(1);
}

const OUTPUT_PATH_SRC = path.resolve(__dirname, '..', 'src', 'lib', 'mockGalleryImages.ts');
const OUTPUT_PATH_ROOT = path.resolve(__dirname, '..', 'data', 'mockGalleryImages.ts');

async function head(url) {
  try {
    const res = await fetchFn(url, { method: 'HEAD' });
    return res && (res.status === 200 || res.status === 204);
  } catch (e) {
    return false;
  }
}

async function fetchPexelsPage(query, per_page, page) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${per_page}&page=${page}`;
  const res = await fetchFn(url, { headers: { Authorization: API_KEY } });
  if (!res.ok) {
    throw new Error(`Pexels API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

function pickImageUrl(photo) {
  // Prefer src.large2x, then large, then original
  const src = photo.src || {};
  return src.large2x || src.large || src.original || null;
}

function normalizeUrl(url) {
  // Ensure https and strip tracking query params if present (keep the file extension)
  if (!url) return url;
  try {
    const u = new URL(url);
    // keep pathname and only keep query params that include 'auto' or size? For safety, drop query
    return `${u.protocol}//${u.hostname}${u.pathname}`;
  } catch (e) {
    return url;
  }
}

async function main() {
  console.log('Starting Pexels fetch/validation. This will make many network requests.');
  const query = 'fashion street portrait';
  const target = 100;
  const per_page = 80; // Pexels max per_page is 80
  let page = 1;
  const seen = new Set();
  const results = [];

  while (results.length < target && page <= 10) {
    console.log(`Fetching page ${page}...`);
    const data = await fetchPexelsPage(query, per_page, page);
    if (!data.photos || data.photos.length === 0) break;

    for (const photo of data.photos) {
      if (results.length >= target) break;
      // filter portrait orientation
      if (!photo.width || !photo.height) continue;
      if (photo.height <= photo.width) continue; // not portrait
      const url = pickImageUrl(photo);
      if (!url) continue;
      const norm = normalizeUrl(url);
      if (seen.has(norm)) continue;
      // quick validation via HEAD
      const ok = await head(norm);
      if (!ok) {
        // try the full URL as fallback
        const ok2 = await head(url);
        if (!ok2) {
          console.warn('Skipping invalid URL:', norm || url);
          continue;
        }
      }
      seen.add(norm);
      results.push({ id: results.length + 1, url: url, width: 900, height: 1200, title: photo.alt || `Pexels ${photo.id}` });
      console.log(`Added ${results.length}: ${url}`);
    }

    if (data.next_page == null && data.photos.length < per_page) break;
    page += 1;
  }

  if (results.length < target) {
    console.warn(`Only found ${results.length} valid portrait images. You can rerun or adjust query.`);
  }

  // Write to src/lib/mockGalleryImages.ts and data/mockGalleryImages.ts
  const fileContent = `// Auto-generated Pexels fallback mock gallery\n` +
    `export const mockGalleryImages = ${JSON.stringify(results, null, 2)};\n\nexport default mockGalleryImages;\n`;

  await fs.mkdir(path.dirname(OUTPUT_PATH_SRC), { recursive: true });
  await fs.writeFile(OUTPUT_PATH_SRC, fileContent, 'utf8');
  console.log('Wrote', OUTPUT_PATH_SRC);

  await fs.mkdir(path.dirname(OUTPUT_PATH_ROOT), { recursive: true });
  await fs.writeFile(OUTPUT_PATH_ROOT, fileContent, 'utf8');
  console.log('Wrote', OUTPUT_PATH_ROOT);

  console.log('Done. Please review the generated files and commit them if desired.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
