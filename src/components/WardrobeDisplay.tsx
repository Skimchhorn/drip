import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WardrobeItem {
  id: string;
  name: string;
  type: 'hanging' | 'folded';
  image: string;
}

interface WardrobeDisplayProps {
  items: WardrobeItem[];
}

export function WardrobeDisplay({ items }: WardrobeDisplayProps) {
  const hangingItems = items.filter(item => item.type === 'hanging').slice(0, 3);
  const foldedItems = items.filter(item => item.type === 'folded').slice(0, 4);

  return (
    <div className="bg-gradient-to-br from-[#d4b896] to-[#c4a87c] rounded-lg p-4 shadow-lg">
      {/* Main wardrobe structure */}
      <div className="bg-[#c4a87c] rounded-lg p-3">
        {/* Top section with hanging rod */}
        <div className="bg-gradient-to-b from-[#e8d4b8] to-[#d4b896] rounded-t-lg p-4 mb-2 min-h-64 relative">
          {/* Hanging rod effect */}
          <div className="absolute top-4 left-4 right-4 h-2 bg-[#8b7355] rounded-full shadow-md"></div>
          
          {/* Hanging clothes */}
          <div className="flex gap-4 justify-center items-start pt-8">
            {hangingItems.map((item, idx) => (
              <div key={item.id} className="flex flex-col items-center">
                {/* Hanger */}
                <div className="w-1 h-4 bg-[#8b7355] rounded mb-1"></div>
                <div className="w-24 h-32 bg-white/80 rounded-lg shadow-md overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drawers section */}
        <div className="bg-gradient-to-b from-[#d4b896] to-[#c4a87c] rounded-b-lg p-4">
          {/* Folded items area */}
          <div className="bg-[#e8d4b8] rounded-lg p-3 mb-3 min-h-24">
            <div className="flex gap-3 flex-wrap">
              {foldedItems.slice(0, 2).map((item) => (
                <div key={item.id} className="w-20 h-16 bg-white/80 rounded shadow-sm overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Drawer pulls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#c4a87c] rounded p-3 shadow-inner border border-[#b89968] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-2 bg-[#8b7355] rounded-full mx-auto mb-1"></div>
                <p className="text-xs text-[#6b5d4f]">DRAWER</p>
              </div>
            </div>
            <div className="bg-[#c4a87c] rounded p-3 shadow-inner border border-[#b89968] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-2 bg-[#8b7355] rounded-full mx-auto mb-1"></div>
                <p className="text-xs text-[#6b5d4f]">DRAWER</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}