'use client';

import { useState } from 'react';
import Masonry from 'react-responsive-masonry';
import { StyleImage } from '../../lib/types';
import { ImageCard } from './ImageCard';

interface GalleryGridProps {
  images: StyleImage[];
  onImageClick: (image: StyleImage) => void;
  onLikeToggle: (id: string) => void;
}

export function GalleryGrid({ images, onImageClick, onLikeToggle }: GalleryGridProps) {
  return (
    <div className="px-4 md:px-8 py-8">
      <Masonry
        columnsCount={4}
        gutter="1rem"
        className="masonry-grid"
      >
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onImageClick={onImageClick}
            onLikeToggle={onLikeToggle}
          />
        ))}
      </Masonry>

      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            .masonry-grid {
              column-count: 2 !important;
            }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .masonry-grid {
              column-count: 3 !important;
            }
          }
        `
      }} />
    </div>
  );
}
