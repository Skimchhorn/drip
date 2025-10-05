'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { StyleImage, Product, TryOnHistory } from '../../lib/types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { CameraUpload } from './CameraUpload';
import { ProductCarousel } from './ProductCarousel';
import { OutfitBuilder } from './OutfitBuilder';
import { TryOnCanvas } from './TryOnCanvas';
import { HistoryPanel } from './HistoryPanel';
import { AnimatedButton } from './AnimatedButton';
import { AIStylesColumn } from './AIStylesColumn';
import { detectGarments, searchProducts, performTryOn, mockGalleryImages } from '../../lib/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface StyleDetailPageProps {
  selectedImage: StyleImage;
  onBack: () => void;
}

export function StyleDetailPage({ selectedImage: initialImage, onBack }: StyleDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState<StyleImage>(initialImage);
  const [userImage, setUserImage] = useState<string>('');
  const [detectedGarments, setDetectedGarments] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [history, setHistory] = useState<TryOnHistory[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [shouldPulse, setShouldPulse] = useState(false);

  // Auto-analyze reference image on mount and when it changes
  useEffect(() => {
    analyzeImage();
  }, [selectedImage.id]);

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    try {
      // Detect garments using Gemini API (mocked)
      const garments = await detectGarments(selectedImage.id);
      setDetectedGarments(garments);

      // Fetch products for each garment type
      const allProducts = await Promise.all(
        garments.map((g) => searchProducts(g.type))
      );
      setProducts(allProducts.flat());
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStyleSelect = (style: StyleImage) => {
    setSelectedImage(style);
    // Trigger pulse animation on detected items
    setShouldPulse(true);
    setTimeout(() => setShouldPulse(false), 1000);
  };

  const handleTryOn = async (product: Product) => {
    if (!userImage) {
      alert('Please upload your photo first!');
      return;
    }

    setLoadingProductId(product.id);
    try {
      const result = await performTryOn(userImage, product.imageUrl);
      setTryOnResult(result);

      // Add to history
      const newHistoryItem: TryOnHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        imageUrl: result,
        products: [product],
        totalPrice: product.price,
      };
      setHistory([newHistoryItem, ...history]);
    } catch (error) {
      console.error('Error performing try-on:', error);
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2>Style Analysis</h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Reference Image (unchanged) */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="mb-4">Reference Look</h3>
              <motion.div 
                className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-4"
                key={selectedImage.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ImageWithFallback
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="space-y-3">
                <div>
                  <h4>{selectedImage.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedImage.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {isAnalyzing ? (
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 animate-pulse" />
                    <p>Analyzing style...</p>
                  </div>
                ) : (
                  <motion.div 
                    className="space-y-2"
                    animate={shouldPulse ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <p>Detected Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {detectedGarments.map((g) => (
                        <Badge key={g.id} variant="outline">
                          {g.type} • {g.color}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}

                <AnimatedButton
                  onClick={analyzeImage}
                  loading={isAnalyzing}
                  icon={<Sparkles className="w-4 h-4" />}
                  className="w-full"
                >
                  Re-analyze
                </AnimatedButton>
              </div>
            </Card>

          </div>

          {/* Right Pane - Upload & AI Styles */}
          <div className="lg:col-span-2 space-y-8">
            {/* Right Pane Container with horizontal layout on desktop */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Upload Your Photo Card (fixed width on desktop) */}
              <div className="w-full lg:w-[360px] flex-shrink-0">
                <CameraUpload onImageCapture={setUserImage} />
              </div>

              {/* AI Styles Column (fills remaining space) */}
              <AIStylesColumn
                availableStyles={mockGalleryImages}
                onStyleSelect={handleStyleSelect}
              />
            </div>

            {/* Similar Garments Section */}
            <motion.div
              animate={shouldPulse ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {products.length > 0 && (
                <Card className="p-6">
                  <h3 className="mb-4">Similar Garments</h3>
                  <ProductCarousel
                    products={products}
                    onTryOn={handleTryOn}
                    loadingProductId={loadingProductId}
                  />
                </Card>
              )}
            </motion.div>

            {/* Try-On Canvas */}
            {userImage && (
              <TryOnCanvas userImage={userImage} tryOnResult={tryOnResult} />
            )}

            {/* Outfit Builder */}
            <OutfitBuilder availableProducts={products} />

            {/* History */}
            {history.length > 0 && (
              <HistoryPanel
                history={history}
                onHistoryClick={(item) => setTryOnResult(item.imageUrl)}
                onDelete={(id) =>
                  setHistory(history.filter((h) => h.id !== id))
                }
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
