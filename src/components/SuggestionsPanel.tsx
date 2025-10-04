import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SuggestionItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface SuggestionsPanelProps {
  suggestions: SuggestionItem[];
  onGeneratePhoto?: () => void;
}

export function SuggestionsPanel({ suggestions, onGeneratePhoto }: SuggestionsPanelProps) {
  return (
    <div className="bg-gradient-to-b from-[#d4b896] to-[#c4a87c] rounded-lg p-4 shadow-inner">
      <div className="bg-[#e8dcc8] rounded-t-lg p-3 text-center">
        <h3 className="text-[#6b5d4f]">SUGGESTIONS</h3>
      </div>
      
      <div className="bg-[#f5ebe0] p-3 space-y-2 max-h-80 overflow-y-auto">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded p-3 flex items-center gap-3 hover:bg-[#faf6f1] transition-colors cursor-pointer border border-[#e0d5c7]"
          >
            <div className="w-12 h-12 bg-[#f5ebe0] rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-[#6b5d4f] text-sm">{item.name}</p>
              <p className="text-[#b89968]">${item.price}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onGeneratePhoto}
        className="w-full mt-3 bg-[#8b7355] text-white py-3 rounded hover:bg-[#7a6248] transition-colors"
      >
        GENERATE PHOTO
      </button>
    </div>
  );
}