# StyleAI - Fashion Discovery & Virtual Try-On Platform

A modern, responsive fashion discovery and virtual try-on platform built with Next.js, TypeScript, React, and Tailwind CSS v4.

## Features

### Gallery Page
- Pinterest-style masonry grid layout (responsive: 2 columns mobile, 3 tablet, 4 desktop)
- Animated heart buttons for liking styles
- Style tags and filtering
- Search functionality
- Smooth hover effects with zoom and fade overlays
- Back to top button

### Style Detail & Try-On Page
- **Reference Look**: View selected style with detected garment analysis
- **AI Style Search**: Ask AI for style recommendations with interactive search
- **Style Thumbnails**: Browse and swap reference looks instantly
- **Camera Upload**: Capture or upload photos for virtual try-on
- **Similar Garments**: Product carousel with retail integration
- **Virtual Try-On**: AI-powered outfit visualization
- **Outfit Builder**: Drag-and-drop interface for creating custom looks
- **Try-On History**: Save and revisit previous try-ons

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd styleai-fashion-platform
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── gallery/            # Gallery page components
│   ├── style/              # Style detail & try-on components
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   └── figma/              # Utility components
├── lib/                     # Utilities and types
│   ├── types.ts            # TypeScript types
│   └── mockData.ts         # Mock data for demo
├── styles/                  # Global styles
│   └── globals.css         # Tailwind v4 configuration
└── public/                  # Static assets
\`\`\`

## Key Components

- **GalleryGrid**: Masonry layout for fashion inspiration feed
- **StyleDetailPage**: Main detail view with try-on features
- **AIStylesColumn**: AI-powered style recommendation interface
- **CameraUpload**: Photo capture/upload functionality
- **ProductCarousel**: Similar garments showcase
- **OutfitBuilder**: Drag-and-drop outfit creation
- **TryOnCanvas**: Virtual try-on visualization

## Design System

The project uses a modern minimalist aesthetic with:
- White/neutral base colors
- Soft shadows and rounded corners (12-16px radius)
- Gradient accents (purple to pink)
- Consistent spacing (8/12/16/24px multiples)
- Motion animations throughout

## API Integration Notes

This demo uses mock data. To integrate real APIs:

1. **Gemini API** (garment detection): Update `detectGarments()` in `lib/mockData.ts`
2. **Retail APIs** (product search): Update `searchProducts()` in `lib/mockData.ts`
3. **Try-On API**: Update `performTryOn()` in `lib/mockData.ts`

## Responsive Design

- **Mobile** (< 768px): Single column, full-width components
- **Tablet** (768px - 1024px): Two columns, optimized layout
- **Desktop** (> 1024px): Three columns, full feature set

## License

MIT

## Credits

Built with inspiration from Pinterest and Drip.ai, showcasing modern web technologies and AI-powered fashion experiences.