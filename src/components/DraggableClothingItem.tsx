import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { GripVertical } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ClothingItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface DraggableClothingItemProps {
  item: ClothingItem;
}

export function DraggableClothingItem({ item }: DraggableClothingItemProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'clothing-item',
    item: item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  drag(elementRef);
  return (
    <div
      ref={elementRef}
      className={`bg-white rounded-lg p-3 flex items-center gap-3 border-2 border-[#e0d5c7] transition-all cursor-move hover:border-[#b89968] hover:shadow-lg ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100'
      }`}
    >
      <GripVertical className="w-5 h-5 text-[#8b7355] flex-shrink-0" />
      
      <div className="w-16 h-16 bg-[#f5ebe0] rounded flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <p className="text-[#6b5d4f]">{item.name}</p>
        <p className="text-[#b89968]">${item.price}</p>
        <p className="text-[#8b7355] text-xs mt-1">{item.category}</p>
      </div>

      {isDragging && (
        <div className="absolute inset-0 bg-[#b89968]/10 rounded-lg pointer-events-none" />
      )}
    </div>
  );
}