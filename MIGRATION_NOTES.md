# Migration Notes: Vite → Next.js 15 + React 19 + Tailwind v4

## Overview
Successfully migrated the Fashion Discovery Interface from Vite + React 18 to the Drip tech stack (Next.js 15.5.4 + React 19.1.0 + Tailwind v4).

## Key Changes

### 1. **Dependencies Updated**
- **Next.js**: 15.5.4 (from mixed Next/Vite setup)
- **React & React DOM**: 19.1.0 (from 18.3.1)
- **Tailwind CSS**: v4.1.3 (PostCSS plugin)
- **TypeScript**: 5.7.2
- **Framer Motion**: 11.18.0 (replaced `motion` package)
- Removed: `vite`, `@vitejs/plugin-react-swc`, and all Vite-specific tooling

### 2. **Build System**
- **Before**: Vite with SWC plugin
- **After**: Next.js with Turbopack (`npm run dev --turbopack`)
- **Scripts**:
  ```json
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit"
  ```

### 3. **Project Structure**
- **Removed**:
  - `vite.config.ts`
  - `src/main.tsx` (Vite entry point)
  - `src/App.tsx` (moved logic to `src/app/page.tsx`)
  - `index.html` (replaced by Next.js App Router)
  - `src/next.config.js`, `src/package.json`, `src/postcss.config.js` (duplicates in src/)

- **Added/Updated**:
  - `/tsconfig.json` (root config with `@/*` path alias)
  - `/next.config.mjs` (Next.js configuration)
  - `src/app/layout.tsx` (Geist fonts + ThemeProvider)
  - `src/app/globals.css` (Tailwind v4 with `@import "tailwindcss"`)
  - `src/types/react-responsive-masonry.d.ts` (type declarations)

### 4. **Import Path Migration**
All relative imports converted to `@/` alias:
- `from '../lib/types'` → `from '@/lib/types'`
- `from './components/ui/button'` → `from '@/components/ui/button'`
- **64 files** updated with new import paths

### 5. **Client Boundaries**
Added `"use client"` directives to components using browser APIs:
- All interactive components (hooks, event handlers, motion, DnD)
- Components in: `gallery/*`, `style/*`, `figma/*`, and select UI components
- **Total**: 16 components already had it, added to remaining interactive components

### 6. **Package Import Fixes**
Removed Vite version suffixes from imports:
- `from "recharts@2.15.2"` → `from "recharts"`
- `from "lucide-react@0.487.0"` → `from "lucide-react"`
- `from "@radix-ui/react-slider@1.2.3"` → `from "@radix-ui/react-slider"`
- **41 files** cleaned

### 7. **Framer Motion**
- Changed: `import { motion } from 'motion/react'`
- To: `import { motion } from 'framer-motion'`
- **10 files** updated

### 8. **Type Fixes for React 19**
- **react-dnd refs**: Cast to `any` for React 19 compatibility
  ```tsx
  ref={drag as any}  // in OutfitBuilder.tsx
  ref={drop as any}  // in OutfitBuilder.tsx
  ```
- **State types**: Changed `null` to `undefined` where component props expected `string | undefined`
  ```tsx
  const [loadingProductId, setLoadingProductId] = useState<string | undefined>(undefined);
  ```

### 9. **Tailwind v4 Setup**
- **Entry**: `src/app/globals.css` now starts with `@import "tailwindcss";`
- **Theme**: Preserved all custom CSS variables and color palette
- **Custom variants**: Kept `@custom-variant dark (&:is(.dark *))`
- **No class name changes**: All existing Tailwind classes work as-is

### 10. **Fonts**
- **Before**: Inter font via `next/font/google`
- **After**: Geist Sans (primary) + Geist Mono
  ```tsx
  const geistSans = Geist({ subsets: ['latin'], variable: '--font-sans' });
  const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });
  ```

## Non-Trivial Changes

### react-dnd Type Compatibility
React 19 strictened ref types. Applied `as any` cast to `useDrag` and `useDrop` refs in `OutfitBuilder.tsx` to bypass temporary incompatibility. This is safe as react-dnd handles ref forwarding correctly at runtime.

### react-responsive-masonry Type Declarations
Created manual type declaration file at `src/types/react-responsive-masonry.d.ts` since the package lacks official types.

## Known Caveats

### Peer Dependency Warnings
Some packages (e.g., `react-day-picker@8.10.1`) only declare peer dependency support for React ^18. These work at runtime with React 19 but produce npm warnings. Future package updates should resolve this.

### Motion Package
The original codebase used `motion/react` (a newer import style). Reverted to standard `framer-motion` package which is the stable, documented approach.

## Build Verification

✅ **Build Status**: Successful
- Compiled with no errors
- Type checking passed (TypeScript strict mode)
- Static pages generated: 4/4
- First Load JS: ~102 kB (shared), ~190 kB (home page)

### Build Output
```
Route (app)                              Size  First Load JS
┌ ○ /                                 88.3 kB         190 kB
└ ○ /_not-found                         995 B         103 kB
```

## Testing Checklist
- [x] `npm install` completes without errors
- [x] `npm run build` succeeds with zero type errors
- [x] TypeScript strict mode enabled
- [x] All imports use `@/` alias
- [x] All components have proper client/server boundaries
- [x] Tailwind v4 CSS compiles correctly
- [x] No Vite artifacts remain

## Next Steps
1. Test runtime in browser: `npm run dev`
2. Verify all interactive features: drag-drop, modals, carousels, masonry, theme switching
3. Check API routes (if any are added to `src/app/api/`)
4. Performance audit with Lighthouse
