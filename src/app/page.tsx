'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { StyleImage } from '@/lib/types';
import { mockGalleryImages } from '@/lib/mockData';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { SearchBar } from '@/components/gallery/SearchBar';
import { FilterDrawer } from '@/components/gallery/FilterDrawer';
import { BackToTop } from '@/components/gallery/BackToTop';
import { StyleDetailPage } from '@/components/style/StyleDetailPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'gallery' | 'detail'>('gallery');
  const [selectedImage, setSelectedImage] = useState<StyleImage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [galleryImages, setGalleryImages] = useState<StyleImage[]>(mockGalleryImages);

  // Filter images based on search query
  const filteredImages = useMemo(() => {
    if (!searchQuery.trim()) return galleryImages;

    const query = searchQuery.toLowerCase();
    return galleryImages.filter(
      (image) =>
        image.title.toLowerCase().includes(query) ||
        image.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [galleryImages, searchQuery]);

  const handleImageClick = (image: StyleImage) => {
    setSelectedImage(image);
    setCurrentPage('detail');
  };

  const handleLikeToggle = (id: string) => {
    setGalleryImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? { ...img, isLiked: !img.isLiked, likes: img.isLiked ? img.likes - 1 : img.likes + 1 }
          : img
      )
    );
  };

  const handleBackToGallery = () => {
    setCurrentPage('gallery');
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentPage === 'gallery' ? (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Navigation Bar */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Logo */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="hidden sm:block">StyleAI</h1>
                  </div>

                  {/* Search Bar */}
                  <div className="flex-1 max-w-2xl">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  </div>

                  {/* Filter */}
                  <FilterDrawer />
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            <GalleryGrid
              images={filteredImages}
              onImageClick={handleImageClick}
              onLikeToggle={handleLikeToggle}
            />

            {/* Back to Top Button */}
            <BackToTop />

            {/* Empty State */}
            {filteredImages.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  No styles found matching "{searchQuery}"
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          selectedImage && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <StyleDetailPage
                selectedImage={selectedImage}
                onBack={handleBackToGallery}
              />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
