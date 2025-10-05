'use client';

import { StyleImage } from '@/lib/types';
import { ImageCard } from '@/components/gallery/ImageCard';
import { SimpleGrid } from '@/components/ui/simple-grid';

interface GalleryGridProps {
  images: StyleImage[];
  onImageClick: (image: StyleImage) => void;
  onLikeToggle: (id: string) => void;
}

export function GalleryGrid({ images, onImageClick, onLikeToggle }: GalleryGridProps) {
  return (
    <div className="px-4 md:px-8 py-8">
      <SimpleGrid minItemWidth={150} gap={16} className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onImageClick={onImageClick}
            onLikeToggle={onLikeToggle}
          />
        ))}
      </SimpleGrid>
    </div>
  );
}
