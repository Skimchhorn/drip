# 👗 Drip - AI-Powered Virtual Try-On & Fashion Discovery Platform

*Your personal AI stylist that transforms fashion inspiration into shoppable reality*

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Google AI](https://img.shields.io/badge/Google_AI-Gemini-4285F4?style=for-the-badge&logo=google)

---

## 🌟 Overview

Drip is an intelligent fashion discovery platform that bridges the gap between style inspiration and reality. Upload a fashion image or search for styles, and let AI identify every piece of clothing, find similar products from real retailers, and virtually try them on using your own photo.

**Key Technical Features:**
- **AI-Powered Garment Detection** using Google Gemini Vision API for multi-modal image analysis
- **Real-time Virtual Try-On** with Fashn.ai integration and progressive image rendering
- **Intelligent Product Search** across ASOS and custom search engines with rate-limit handling
- **Progressive Image Loading** with infinite scroll and optimized batch processing
- **Responsive Masonry Layout** using Framer Motion animations and React DnD

---

## 🛠️ Tech Stack

**Frontend:** Next.js 15.5 (App Router), React 19, TypeScript, TailwindCSS 4.1, Framer Motion
**UI Components:** Radix UI, Shadcn/ui, Lucide React, Sonner
**AI/ML:** Google Gemini API, Fashn.ai Virtual Try-On API
**APIs:** Google Custom Search API, ASOS API, ImgBB Image Hosting
**State Management:** React Hooks, Client-side caching

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Cloud API Key (for Gemini AI)
- Google Custom Search API credentials
- Fashn.ai API Key
- ImgBB API Key

### Environment Variables
Create a `.env.local` file in the root directory:

```bash
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_API_KEY=your_search_api_key
STYLE_SEARCH_ID=your_style_search_engine_id
GARMENT_SEARCH_ID=your_garment_search_engine_id
FASHN_API_KEY=your_fashn_api_key
IMGBB_API_KEY=your_imgbb_api_key
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/drip.git
cd drip

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📱 How to Use

1. **Browse Fashion Inspiration**
   - Search for styles using keywords (e.g., "streetwear", "minimalist fashion")
   - Browse the infinite-scrolling gallery of curated fashion images
   - Click any style that catches your eye

2. **AI Garment Analysis**
   - The app automatically analyzes the selected image using Gemini Vision API
   - Detects clothing items (tops, bottoms, outerwear, shoes)
   - Extracts style attributes, colors, and garment types

3. **Shop Similar Products**
   - View AI-suggested products from real retailers matching the detected garments
   - Products load progressively as the API processes each garment
   - Browse brand names, prices, and direct retailer links

4. **Virtual Try-On**
   - Upload your own photo using the camera/upload feature
   - Select any product from the carousel
   - Watch the AI generate a realistic virtual try-on result
   - Save your try-on history for comparison

5. **Upload Custom Styles**
   - Click "Upload Style" to analyze your own fashion inspiration photos
   - Get instant AI-powered garment detection and product recommendations

---

## 📂 Project Structure

```
📁 src/
├── 📁 app/                     # Next.js App Router
│   ├── 📁 api/                 # API routes
│   │   ├── 📁 fashAI/          # Virtual try-on endpoint
│   │   ├── 📁 gemini_*/        # Gemini AI integrations
│   │   ├── 📁 style_search/    # Fashion image search
│   │   └── 📁 garment_search/  # Product search
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Main gallery page
├── 📁 components/
│   ├── 📁 gallery/             # Image grid & search UI
│   ├── 📁 style/               # Style detail & try-on components
│   ├── 📁 ui/                  # Reusable Shadcn components
│   └── 📁 figma/               # Design system components
├── 📁 lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── mockData.ts             # Data utilities & transformers
│   └── utils.ts                # Helper functions
├── 📁 styles/                  # Global CSS and theme
└── 📁 public/                  # Static assets & images
```

---

## 💡 Technical Highlights

### 🤖 AI-Powered Image Analysis
- **Multi-Modal Processing**: Leverages Google Gemini's vision capabilities to extract garment metadata from images
- **Progressive Updates**: Real-time UI updates as each garment detection completes
- **Keyword Extraction**: Intelligent text and image-based keyword generation for accurate product matching

### 🔍 Intelligent Search & Rate Limiting
- **Debounced Search**: 500ms delay prevents excessive API calls during user typing
- **Rate Limit Handling**: Graceful degradation with 429 error detection and request batching
- **Infinite Scroll**: Lazy-loaded image batches (20 at a time) for optimal performance

### 🎨 Virtual Try-On Pipeline
- **Image Upload Flow**: Base64 encoding → ImgBB hosting → Fashn.ai processing
- **Polling Mechanism**: Asynchronous job status checks with 3-second intervals (max 30s timeout)
- **Error Recovery**: Comprehensive error handling for upload failures and timeout scenarios

### ⚡ Performance Optimizations
- **Next.js 15 Turbopack**: Lightning-fast development builds
- **Image Optimization**: Next.js Image component with lazy loading and responsive sizing
- **Client-Side Caching**: Local state management reduces redundant API calls
- **Framer Motion**: Hardware-accelerated animations with AnimatePresence

### 🎯 State Management Architecture
- **React Hooks Pattern**: useState, useEffect, useMemo for reactive UI updates
- **History Tracking**: Try-on results stored with timestamps and product metadata
- **Optimistic Updates**: Immediate UI feedback with background API synchronization

---

## 🔮 Future Enhancements

- [ ] User authentication and personalized style profiles
- [ ] Social sharing for try-on results and outfit compositions
- [ ] Advanced filters (price range, brand preferences, size availability)
- [ ] AR-powered live camera try-on (WebXR integration)
- [ ] Outfit builder with mix-and-match functionality
- [ ] Price tracking and sale notifications
- [ ] Multi-language support and global retailer integration
- [ ] Machine learning-based style recommendations
- [ ] Collaborative mood boards and style collections

---

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ using Next.js, TypeScript, and cutting-edge AI technology**
