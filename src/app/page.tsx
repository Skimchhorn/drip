'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { StyleImage } from '@/lib/types';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { SearchBar } from '@/components/gallery/SearchBar';
import { FilterDrawer } from '@/components/gallery/FilterDrawer';
import { BackToTop } from '@/components/gallery/BackToTop';
import { StyleDetailPage } from '@/components/style/StyleDetailPage';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'gallery' | 'detail'>('gallery');
  const [selectedImage, setSelectedImage] = useState<StyleImage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allImages, setAllImages] = useState<StyleImage[]>([]);
  const [displayedImages, setDisplayedImages] = useState<StyleImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const IMAGES_PER_BATCH = 20;

  // Fetch all images from style_search endpoint
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const query = searchQuery.trim() || 'fashion';
        const response = await fetch(`/api/style_search?q=${encodeURIComponent(query)}&num=100`);
        const data = await response.json();

        if (response.ok && data.images) {
          const transformedImages: StyleImage[] = data.images.map((img: any, index: number) => ({
            id: `img-${index}`,
            title: '',
            imageUrl: img.url,
            tags: [],
            likes: 0,
            isLiked: false,
          }));

          console.log('Total images fetched:', transformedImages.length);
          setAllImages(transformedImages);
          // Load first batch
          setDisplayedImages(transformedImages.slice(0, IMAGES_PER_BATCH));
          setCurrentIndex(IMAGES_PER_BATCH);
          console.log('Displayed initial batch:', IMAGES_PER_BATCH, 'Total available:', transformedImages.length);
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [searchQuery]);

  const loadMoreImages = () => {
    if (currentIndex >= allImages.length || isLoadingMore) {
      console.log('Cannot load more:', { currentIndex, totalImages: allImages.length, isLoadingMore });
      return;
    }

    console.log('Loading more images from index:', currentIndex);
    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextBatch = allImages.slice(currentIndex, currentIndex + IMAGES_PER_BATCH);
      console.log('Loading batch:', nextBatch.length, 'images');
      setDisplayedImages(prev => [...prev, ...nextBatch]);
      setCurrentIndex(prev => prev + IMAGES_PER_BATCH);
      setIsLoadingMore(false);
    }, 300);
  };

  // Infinite scroll handler
  useEffect(() => {
    if (currentPage !== 'gallery') return;

    const handleScroll = () => {
      if (isLoadingMore || currentIndex >= allImages.length) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Load more when user is near bottom (200px from bottom)
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        loadMoreImages();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  // No longer need to filter - images are fetched based on search query
  const filteredImages = displayedImages;

  const handleImageClick = (image: StyleImage) => {
    setSelectedImage(image);
    setCurrentPage('detail');
  };

  const handleLikeToggle = (id: string) => {
    setDisplayedImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? { ...img, isLiked: !img.isLiked, likes: img.isLiked ? img.likes - 1 : img.likes + 1 }
          : img
      )
    );
    setAllImages((prev) =>
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

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Loading images...</p>
              </div>
            )}

            {/* Loading More State */}
            {isLoadingMore && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading more...</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredImages.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No images found</p>
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