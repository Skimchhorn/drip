fetch-pexels-mock.js

This script queries the Pexels API for portrait-oriented fashion/street photos, validates each image URL, and writes a verified array to `src/lib/mockGalleryImages.ts` and `data/mockGalleryImages.ts`.

Requirements
- Node 18+ (global fetch) or install `node-fetch` (script already attempts to use node-fetch as fallback).
- A Pexels API key. Get one here: https://www.pexels.com/api/

Usage

```bash
# POSIX
PEXELS_API_KEY=your_key node scripts/fetch-pexels-mock.js

# Windows (PowerShell)
$env:PEXELS_API_KEY = 'your_key'
node scripts/fetch-pexels-mock.js
```

Outputs
- `src/lib/mockGalleryImages.ts` (default export mockGalleryImages)
- `data/mockGalleryImages.ts` (same content)

Notes
- The script validates each URL with a HEAD request before including it.
- It stops when it has 100 valid portraits, or when it exhausts the search results.
- Review the generated file before committing (Pexels license allows free use but attribution recommended in production).
