'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { StyleImage } from '@/lib/types';
import { SearchInput } from '@/components/style/SearchInput';
import { SearchButton } from '@/components/style/SearchButton';
import { StyleThumbnailCard } from '@/components/style/StyleThumbnailCard';
import { Skeleton } from '@/components/ui/skeleton';

interface AIStylesColumnProps {
  availableStyles: StyleImage[];
  onStyleSelect: (style: StyleImage) => void;
}

export function AIStylesColumn({ availableStyles, onStyleSelect }: AIStylesColumnProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [recommendedStyles, setRecommendedStyles] = useState<StyleImage[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock AI response
    const mockResponse = `Based on your search for "${searchQuery}", I've found some perfect matches! These styles capture the essence of what you're looking for with carefully curated pieces that blend comfort and sophistication. Each look features versatile items that can be mixed and matched to create your unique style statement.`;
    
    setAiResponse(mockResponse);
    
    // Filter and recommend styles based on search query
    const filtered = availableStyles.filter(style => 
      style.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // If no direct matches, show random suggestions
    const recommendations = filtered.length > 0 
      ? filtered.slice(0, 6)
      : availableStyles.slice(0, 6);
    
    setRecommendedStyles(recommendations);
    setIsSearching(false);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-6 rounded-2xl bg-muted/30 shadow-sm border border-border/50">
      {/* Search Row */}
      <div className="flex items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onEnter={handleSearch}
          disabled={isSearching}
        />
        <SearchButton
          onClick={handleSearch}
          loading={isSearching}
          label="Ask AI"
        />
      </div>

      {/* AI Output Panel */}
      <div className="flex-1 min-h-[300px] p-5 rounded-2xl border border-border bg-background overflow-y-auto">
        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Sparkles className="w-12 h-12 mb-4 opacity-30" />
            <p>Ask AI for style recommendations</p>
            <p className="mt-2">Try: "casual summer", "minimal street", or "urban chic"</p>
          </div>
        ) : isSearching ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* User Query */}
            <div className="flex justify-end">
              <div className="inline-block px-4 py-2 rounded-xl bg-primary text-primary-foreground">
                {searchQuery}
              </div>
            </div>
            
            {/* AI Response */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 p-4 rounded-xl bg-muted/50">
                <p className="text-foreground">{aiResponse}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styles Thumbnail Rail */}
      {recommendedStyles.length > 0 && (
        <div className="space-y-3">
          <h4 className="px-1">Recommended Styles</h4>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {recommendedStyles.map((style) => (
              <StyleThumbnailCard
                key={style.id}
                style={style}
                onClick={onStyleSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}