'use client';

import { motion } from 'framer-motion';
import { StyleImage } from '../../lib/types';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface StyleThumbnailCardProps {
  style: StyleImage;
  onClick: (style: StyleImage) => void;
}

export function StyleThumbnailCard({ style, onClick }: StyleThumbnailCardProps) {
  return (
    <motion.button
      onClick={() => onClick(style)}
      className="relative flex-shrink-0 w-[120px] h-[160px] rounded-xl overflow-hidden shadow-sm bg-muted group cursor-pointer"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <ImageWithFallback
        src={style.imageUrl}
        alt={style.title}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity" />
      
      {/* Label */}
      <div className="absolute top-2 left-2 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs">
        {style.title}
      </div>
      
      {/* Hover border glow */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-xl transition-colors pointer-events-none" />
    </motion.button>
  );
}