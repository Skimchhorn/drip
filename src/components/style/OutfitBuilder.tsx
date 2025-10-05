'use client';

import { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Product, OutfitSlot } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion } from 'framer-motion';

const GARMENT_TYPE_LABELS = {
  top: 'Top',
  bottom: 'Bottom',
  outerwear: 'Outerwear',
  shoes: 'Shoes',
};

interface DraggableProductProps {
  product: Product;
}

function DraggableProduct({ product }: DraggableProductProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'product',
    item: product,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as any}
      className={`cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <Card className="p-3">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="line-clamp-1">{product.brand}</p>
      </Card>
    </div>
  );
}

interface DropSlotProps {
  slot: OutfitSlot;
  onDrop: (product: Product) => void;
  onRemove: () => void;
}

function DropSlot({ slot, onDrop, onRemove }: DropSlotProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'product',
    drop: (item: Product) => {
      if (item.garmentType === slot.type) {
        onDrop(item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop as any}
      className={`relative p-4 border-2 border-dashed rounded-2xl transition-all ${
        isOver ? 'border-primary bg-primary/10' : 'border-border'
      }`}
    >
      <div className="mb-2">
        <span>{GARMENT_TYPE_LABELS[slot.type]}</span>
      </div>
      
      {slot.product ? (
        <div className="relative">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <ImageWithFallback
              src={slot.product.imageUrl}
              alt={slot.product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground shadow-lg hover:scale-110 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="mt-2">
            <p className="line-clamp-1">{slot.product.name}</p>
            <p>${slot.product.price.toFixed(2)}</p>
          </div>
        </div>
      ) : (
        <div className="aspect-square rounded-lg border-2 border-dashed border-muted flex items-center justify-center text-muted-foreground">
          Drop here
        </div>
      )}
    </div>
  );
}

interface OutfitBuilderProps {
  availableProducts: Product[];
}

export function OutfitBuilder({ availableProducts }: OutfitBuilderProps) {
  const [outfit, setOutfit] = useState<OutfitSlot[]>([
    { type: 'top', product: null },
    { type: 'bottom', product: null },
    { type: 'outerwear', product: null },
    { type: 'shoes', product: null },
  ]);

  const handleDrop = (index: number, product: Product) => {
    const newOutfit = [...outfit];
    newOutfit[index].product = product;
    setOutfit(newOutfit);
  };

  const handleRemove = (index: number) => {
    const newOutfit = [...outfit];
    newOutfit[index].product = null;
    setOutfit(newOutfit);
  };

  const totalPrice = outfit.reduce(
    (sum, slot) => sum + (slot.product?.price || 0),
    0
  );

  const allRetailerLinks = outfit
    .filter((slot) => slot.product)
    .map((slot) => slot.product!.retailerLink);

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="p-6">
        <h3 className="mb-4">Outfit Builder</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {outfit.map((slot, index) => (
            <DropSlot
              key={slot.type}
              slot={slot}
              onDrop={(product) => handleDrop(index, product)}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>

        <div className="space-y-4 p-4 bg-muted rounded-xl">
          <div className="flex justify-between items-center">
            <span>Total Price:</span>
            <span className="text-xl">${totalPrice.toFixed(2)}</span>
          </div>
          
          {allRetailerLinks.length > 0 && (
            <Button className="w-full" asChild>
              <a href={allRetailerLinks[0]} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Retailer
              </a>
            </Button>
          )}
        </div>
      </Card>
    </DndProvider>
  );
}
