'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StyleImage } from '@/lib/types';
import Image from 'next/image';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { SearchBar } from '@/components/gallery/SearchBar';
import { FilterDrawer } from '@/components/gallery/FilterDrawer';
import { BackToTop } from '@/components/gallery/BackToTop';
import { StyleDetailPage } from '@/components/style/StyleDetailPage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'gallery' | 'detail'>('gallery');
  const [selectedImage, setSelectedImage] = useState<StyleImage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allImages, setAllImages] = useState<StyleImage[]>([]);
  const [displayedImages, setDisplayedImages] = useState<StyleImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const IMAGES_PER_BATCH = 20;

  // Fetch all images from style_search endpoint with debouncing
  useEffect(() => {
    // Debounce search - wait 500ms after user stops typing
    const timeoutId = setTimeout(() => {
      const fetchImages = async () => {
        try {
          setIsLoading(true);
          const allFetchedImages: StyleImage[] = [];
          const query = searchQuery.trim() || 'fashion';
          const searchId = Date.now(); // Unique ID for this search to avoid key collisions

          // Start with fewer requests to avoid rate limiting
          // Make requests sequentially with delay to respect rate limits
          const maxRequests = 3; // Reduced from 10 to 3

          for (let i = 0; i < maxRequests; i++) {
            const start = i * 10 + 1;

            try {
              const response = await fetch(`/api/style_search?q=${encodeURIComponent(query)}&num=10&start=${start}`);
              const data = await response.json();

              if (response.ok && data.images) {
                const transformedImages: StyleImage[] = data.images.map((img: any, index: number) => ({
                  id: `${searchId}-img-${start + index}`,
                  title: img.title || 'Fashion Style',
                  imageUrl: img.url,
                  tags: ['fashion', 'style'],
                  likes: Math.floor(Math.random() * 500),
                  isLiked: false,
                }));
                allFetchedImages.push(...transformedImages);
              } else if (response.status === 429) {
                // Hit rate limit, stop making more requests
                console.warn('Rate limit reached, stopping requests');
                break;
              }

              // Add small delay between requests to avoid rate limiting
              if (i < maxRequests - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            } catch (error) {
              console.error(`Failed to fetch batch ${i + 1}:`, error);
              break;
            }
          }

          console.log('Total images fetched:', allFetchedImages.length);
          setAllImages(allFetchedImages);
          // Load first batch
          setDisplayedImages(allFetchedImages.slice(0, IMAGES_PER_BATCH));
          setCurrentIndex(IMAGES_PER_BATCH);
          console.log('Displayed initial batch:', IMAGES_PER_BATCH, 'Total available:', allFetchedImages.length);
        } catch (error) {
          console.error('Failed to fetch images:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchImages();
    }, 500); // Wait 500ms after user stops typing

    // Cleanup timeout if search query changes before timeout completes
    return () => clearTimeout(timeoutId);
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

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
          setShowUploadDialog(true);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleConfirmUpload = () => {
    setShowUploadDialog(false);
    if (uploadedImage) {
      // Create a StyleImage from the uploaded photo
      const uploadedStyleImage: StyleImage = {
        id: `uploaded-${Date.now()}`,
        title: 'Your Reference Photo',
        imageUrl: uploadedImage,
        tags: ['uploaded', 'reference'],
        likes: 0,
        isLiked: false,
      };
      setSelectedImage(uploadedStyleImage);
      setCurrentPage('detail');
    }
  };

  const handleCancelUpload = () => {
    setShowUploadDialog(false);
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen">
      {/* Upload Confirmation Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Reference Photo</DialogTitle>
            <DialogDescription>
              Do you want to set this as your reference photo?
            </DialogDescription>
          </DialogHeader>
          {uploadedImage && (
            <div className="flex justify-center py-4">
              <Image
                src={uploadedImage}
                alt="Uploaded reference"
                width={300}
                height={300}
                className="rounded-lg object-cover max-h-64"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelUpload}>
              Cancel
            </Button>
            <Button onClick={handleConfirmUpload}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-3 h-[70px] sm:h-[78px] flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/logo-removebg-preview.png"
                alt="Logo"
                width={120}
                height={120}
                className="w-24 sm:w-28 md:w-32 h-auto rounded-xl"
                priority
              />
            </div>

            {/* Upload Style Button and Search Bar */}
            <div className="flex items-center gap-5 sm:gap-8 w-full sm:w-auto sm:flex-1 max-w-full sm:max-w-2xl px-2 sm:px-4">
              <Button
                onClick={handleUploadClick}
                variant="outline"
                className="flex items-center gap-2 whitespace-nowrap px-2 sm:px-4 py-2 flex-shrink-0 h-9 sm:h-10"
              >
                <Upload className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline text-sm">Upload Style</span>
              </Button>
              <div className="flex-1 min-w-0">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>
            </div>
          </div>
        </div>


            {/* Gallery Grid */}
            <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
              <GalleryGrid
                images={filteredImages}
                onImageClick={handleImageClick}
                onLikeToggle={handleLikeToggle}
              />
            </div>

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
