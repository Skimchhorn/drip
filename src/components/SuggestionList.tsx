'use client';

import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { GripVertical, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ClothingItem } from "./HomePage"
interface DraggableItemProps {
  item: ClothingItem;
}

function DraggableItem({ item }: DraggableItemProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'clothing-item',
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  drag(elementRef);

  return (
    <div
      ref={elementRef}
      className={`bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 border-2 border-[#e0d5c7] transition-all cursor-move hover:border-[#b89968] hover:shadow-lg hover:scale-105 ${
        isDragging ? 'opacity-30 scale-95' : 'opacity-100'
      }`}
    >
      <GripVertical className="w-5 h-5 text-[#8b7355] flex-shrink-0" />

      <div className="w-14 h-14 bg-gradient-to-br from-[#f5ebe0] to-[#e8dcc8] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden shadow-md">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[#6b5d4f] truncate">{item.name}</p>
        <p className="text-[#b89968]">${item.price}</p>
      </div>

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 p-2 rounded-lg bg-[#b89968] hover:bg-[#a07d4d] text-white transition-colors"
          title="View on ASOS"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

interface SuggestionsListProps {
  items: ClothingItem[];
}

export default function SuggestionsList({ items }: SuggestionsListProps) {
  return (
    <div className="h-full w-full overflow-y-auto p-4 space-y-3 custom-scrollbar">
      {items.map((item) => (
        <DraggableItem key={item.id} item={item} />
      ))}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(196, 181, 160, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #b89968;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a07d4d;
        }
      `}</style>
    </div>
  );
}
