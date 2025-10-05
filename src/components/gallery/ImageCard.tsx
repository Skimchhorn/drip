'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { StyleImage } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface ImageCardProps {
  image: StyleImage;
  onImageClick: (image: StyleImage) => void;
  onLikeToggle: (id: string) => void;
}

export function ImageCard({ image, onImageClick, onLikeToggle }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onImageClick(image)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm">
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ImageWithFallback
            src={image.imageUrl}
            alt={image.title}
            className="w-full h-auto object-cover"
          />
        </motion.div>

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
        />

        {/* Content overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 p-4 text-white"
        >
          <h3 className="mb-2">{image.title}</h3>
          <div className="flex flex-wrap gap-2">
            {image.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/20 backdrop-blur-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Like button */}
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(image.id);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
        >
          <motion.div
            animate={{
              scale: image.isLiked ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-5 h-5 ${
                image.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
            />
          </motion.div>
        </motion.button>

        {/* Like count */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/60 text-white backdrop-blur-sm shadow-sm">
          <span className="text-sm font-medium">{image.likes}</span>
        </div>
      </div>
    </motion.div>
  );
}
