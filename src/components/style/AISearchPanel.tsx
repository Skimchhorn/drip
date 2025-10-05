'use client';

import { useState } from 'react';
import { Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { SearchInput } from '@/components/style/SearchInput';
import { SearchButton } from '@/components/style/SearchButton';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

type GeminiTextResponse = {
  feedback: string;
  style_keywords: {
    [key: string]: string; // e.g., { style_1: "minimal streetwear", style_2: "business casual", ... }
  };
};

type GarmentItem = {
  title: string;
  url: string;
  pageUrl?: string;
  source?: string;
};

type Tile = {
  keyword: string;
  imageUrl: string;
  productUrl: string;
  source?: string;
};

type AiSearchState = 'idle' | 'loading' | 'error' | 'success';

interface AISearchPanelProps {
  onReferenceReplace: (imageUrl: string) => void;
}

export function AISearchPanel({ onReferenceReplace }: AISearchPanelProps) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<AiSearchState>('idle');
  const [feedback, setFeedback] = useState('');
  const [styleKeywords, setStyleKeywords] = useState<string[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  async function getGeminiSuggestions(text: string): Promise<GeminiTextResponse> {
    const response = await fetch('/api/gemini_keywords_from_text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI suggestions');
    }

    return response.json();
  }

  async function searchOneImage(keyword: string): Promise<Tile | null> {
    try {
      // Use the style_search endpoint with the keyword
      const response = await fetch(`/api/style_search?q=${encodeURIComponent(keyword)}&num=1`);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      // Extract first image from images array
      if (data.images && data.images.length > 0) {
        const firstImage = data.images[0];
        return {
          keyword,
          imageUrl: firstImage.url,
          productUrl: firstImage.pageUrl || '#',
          source: firstImage.source,
        };
      }

      return null;
    } catch (e) {
      console.error(`Failed to search for "${keyword}":`, e);
      return null;
    }
  }

  async function handleAskAI() {
    if (!query.trim()) return;

    setStatus('loading');
    setError(undefined);

    try {
      const res = await getGeminiSuggestions(query.trim());
      setFeedback(res.feedback);

      // Convert style_keywords object to array
      const keywordsArray = Object.values(res.style_keywords ?? {});
      setStyleKeywords(keywordsArray);

      // Search for one garment per keyword
      const results = await Promise.allSettled(keywordsArray.map(k => searchOneImage(k)));

      const newTiles = results
        .map(r => (r.status === 'fulfilled' ? r.value : null))
        .filter((t): t is Tile => !!t);

      // Deduplicate by imageUrl
      const uniqueTiles = newTiles.reduce((acc, tile) => {
        if (!acc.find(t => t.imageUrl === tile.imageUrl)) {
          acc.push(tile);
        }
        return acc;
      }, [] as Tile[]);

      setTiles(uniqueTiles);
      setStatus('success');
    } catch (e) {
      setError('Failed to get AI suggestions. Try again.');
      setStatus('error');
    }
  }

  function handleTileClick(tile: Tile) {
    onReferenceReplace(tile.imageUrl);
  }

  function scrollTiles(direction: 'left' | 'right') {
    const container = document.getElementById('tiles-container');
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 h-full">
      {/* Search Row */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <SearchInput
          value={query}
          onChange={setQuery}
          onEnter={handleAskAI}
          disabled={status === 'loading'}
        />
        <SearchButton
          onClick={handleAskAI}
          loading={status === 'loading'}
          label="Ask AI"
        />
      </div>

      {/* Middle Card - AI Output */}
      <div className="h-[160px] flex-shrink-0 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-y-auto">
        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Sparkles className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">Ask AI for style recommendations</p>
            <p className="mt-1 text-xs">Try: &quot;casual summer outfits&quot;</p>
          </div>
        )}

        {status === 'loading' && (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Thinking...</span>
          </div>
        )}

        {status === 'error' && (
          <div className="text-sm text-destructive">
            {error}
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-2">
            {/* AI Feedback */}
            <p className="text-xs text-foreground leading-relaxed">{feedback}</p>

            {/* Style Keywords */}
            {styleKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {styleKeywords.map((keyword, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Rectangle - Image Tiles */}
      <div className="h-[160px] flex-shrink-0 p-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 relative overflow-hidden">
        {status === 'idle' && (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground">
            <p className="text-xs">Style results will appear here</p>
          </div>
        )}

        {status === 'loading' && (
          <div className="flex gap-2 overflow-x-auto h-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="snap-start w-[80px] h-full rounded-lg bg-zinc-800/60 flex-shrink-0" />
            ))}
          </div>
        )}

        {status === 'success' && tiles.length > 0 && (
          <>
            <div
              id="tiles-container"
              className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent h-full"
            >
              {tiles.map((tile, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTileClick(tile)}
                  className="snap-start w-[80px] h-full rounded-lg overflow-hidden flex-shrink-0 group relative hover:ring-2 hover:ring-primary transition-all"
                >
                  <img
                    src={tile.imageUrl}
                    alt={tile.keyword}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="absolute bottom-1 left-1 right-1 text-[10px] text-white line-clamp-2 leading-tight">
                      {tile.keyword}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Scroll buttons */}
            {tiles.length > 5 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-zinc-900/90 hover:bg-zinc-800 h-7 w-7"
                  onClick={() => scrollTiles('left')}
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-zinc-900/90 hover:bg-zinc-800 h-7 w-7"
                  onClick={() => scrollTiles('right')}
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </>
            )}
          </>
        )}

        {status === 'success' && tiles.length === 0 && (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground text-xs">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}
