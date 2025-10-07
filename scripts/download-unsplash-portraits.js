// scripts/download-unsplash-portraits.js
// Downloads 50 portrait images from source.unsplash.com (fashion/editorial/streetwear queries)
// into ./public/mock-portraits/portrait-001.jpg ... portrait-050.jpg
// Usage: node scripts/download-unsplash-portraits.js

const fs = require('fs');
const https = require('https');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'mock-portraits');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 400) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`Request failed ${url} - ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  try {
    for (let i = 1; i <= 50; i++) {
      const sig = i;
      // Query terms tuned to fashion/editorial/streetwear; Unsplash Source returns a random photo matching the query
      const query = encodeURIComponent('fashion,streetwear,editorial');
      const url = `https://source.unsplash.com/1080x1620/?${query}&sig=${sig}`;
      const filename = `portrait-${String(i).padStart(3, '0')}.jpg`;
      const dest = path.join(outDir, filename);
      console.log(`Downloading ${url} -> ${dest}`);
      await download(url, dest);
    }
    console.log('All images downloaded to', outDir);
  } catch (err) {
    console.error('Error downloading images:', err);
    process.exitCode = 1;
  }
})();
