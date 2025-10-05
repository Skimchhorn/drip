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
      const response = await fetch(`/api/style_search?styleReference=${encodeURIComponent(keyword)}&num=1`);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      // Extract first image from results
      if (data.results && data.results.length > 0) {
        const firstImage = data.results[0];
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
    <div className="flex-1 flex flex-col gap-4 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
      {/* Search Row */}
      <div className="flex items-center gap-3">
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
      <div className="h-[180px] p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-y-auto">
        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Sparkles className="w-12 h-12 mb-4 opacity-30" />
            <p>Ask AI for style recommendations</p>
            <p className="mt-2 text-sm">Try: &quot;casual summer outfits&quot; or &quot;minimal streetwear&quot;</p>
          </div>
        )}

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-zinc-800/60" />
              <Skeleton className="h-4 w-5/6 bg-zinc-800/60" />
              <Skeleton className="h-4 w-4/6 bg-zinc-800/60" />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-sm text-destructive">
            {error}
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            {/* AI Feedback */}
            <p className="text-sm text-foreground line-clamp-5">{feedback}</p>

            {/* Style Keywords */}
            {styleKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {styleKeywords.map((keyword, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Rectangle - Image Tiles */}
      <div className="h-[180px] p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 relative">
        {status === 'idle' && (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground">
            <p className="text-sm">Style results will appear here</p>
          </div>
        )}

        {status === 'loading' && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="snap-start min-w-[100px] h-[140px] rounded-lg bg-zinc-800/60 flex-shrink-0" />
            ))}
          </div>
        )}

        {status === 'success' && tiles.length > 0 && (
          <>
            <div
              id="tiles-container"
              className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent h-full"
            >
              {tiles.map((tile, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTileClick(tile)}
                  className="snap-start min-w-[100px] h-[140px] rounded-lg overflow-hidden flex-shrink-0 group relative hover:ring-2 hover:ring-primary transition-all"
                >
                  <img
                    src={tile.imageUrl}
                    alt={tile.keyword}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="absolute bottom-1 left-1 right-1 text-xs text-white line-clamp-2">
                      {tile.keyword}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Scroll buttons */}
            {tiles.length > 4 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-zinc-900/80 hover:bg-zinc-800 h-8 w-8"
                  onClick={() => scrollTiles('left')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-zinc-900/80 hover:bg-zinc-800 h-8 w-8"
                  onClick={() => scrollTiles('right')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </>
        )}

        {status === 'success' && tiles.length === 0 && (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground text-sm">
            No results found
          </div>
        )}
      </div>
    </div>
  );
}
