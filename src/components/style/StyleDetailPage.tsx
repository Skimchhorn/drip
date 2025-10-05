'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { StyleImage, Product, TryOnHistory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CameraUpload } from '@/components/style/CameraUpload';
import { ProductCarousel } from '@/components/style/ProductCarousel';
import { OutfitBuilder } from '@/components/style/OutfitBuilder';
import { HistoryPanel } from '@/components/style/HistoryPanel';
import { AnimatedButton } from '@/components/style/AnimatedButton';
import { AISearchPanel } from '@/components/style/AISearchPanel';
import { getGarmentSuggestionsFromImage, convertGarmentResultsToProducts } from '@/lib/mockData';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

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
  const [loadingProductId, setLoadingProductId] = useState<string | undefined>(undefined);
  const [shouldPulse, setShouldPulse] = useState(false);
  const [tryOnError, setTryOnError] = useState<string | null>(null);

  const displayImage = tryOnResult ?? (userImage || null);

  const handleUserImageCapture = (image: string) => {
    setUserImage(image);
    setTryOnResult(null);
    setTryOnError(null);
  };

  const handleResetCapture = () => {
    setUserImage('');
    setTryOnResult(null);
    setTryOnError(null);
  };

  // Auto-analyze reference image on mount and when it changes
  useEffect(() => {
    analyzeImage();
  }, [selectedImage.id]);

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    try {
      console.log('Analyzing image:', selectedImage.imageUrl);

      // Get garment suggestions from image using Gemini API
      const result = await getGarmentSuggestionsFromImage(selectedImage.imageUrl);

      // Set detected garments from the garment_keywords object
      const garmentList = Object.entries(result.garment_keywords).map(([key, value]) => ({
        id: key,
        type: value,
        color: '',
        confidence: 1.0,
      }));
      setDetectedGarments(garmentList);

      // Convert garment search results to Product format
      const productList = convertGarmentResultsToProducts(result.garment_results);
      setProducts(productList);
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

  const handleReferenceReplace = async (imageUrl: string) => {
    // Update the reference image
    setSelectedImage({
      ...selectedImage,
      imageUrl,
    });

    // Trigger garment search with the new reference image
    setIsAnalyzing(true);
    try {
      const result = await getGarmentSuggestionsFromImage(imageUrl);

      const garmentList = Object.entries(result.garment_keywords).map(([key, value]) => ({
        id: key,
        type: value,
        color: '',
        confidence: 1.0,
      }));
      setDetectedGarments(garmentList);

      const productList = convertGarmentResultsToProducts(result.garment_results);
      setProducts(productList);
    } catch (error) {
      console.error('Error analyzing new reference:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTryOn = async (product: Product) => {
    if (!userImage) {
      alert('Please upload your photo first!');
      return;
    }

    setLoadingProductId(product.id);
    setTryOnError(null);
    try {
      const response = await fetch('/api/fashAI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelImage: userImage,
          garmentImage: product.imageUrl,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Try-on request failed');
      }

      if (!payload?.output) {
        throw new Error('Try-on response did not include an image');
      }

      const resultUrl = payload.output as string;
      setTryOnResult(resultUrl);

      // Add to history
      const newHistoryItem: TryOnHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        imageUrl: resultUrl,
        products: [product],
        totalPrice: product.price,
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    } catch (error) {
      console.error('Error performing try-on:', error);
      setTryOnError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoadingProductId(undefined);
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
                    <p>Items from this style:</p>
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
              <div className="w-full lg:w-[360px] flex-shrink-0 space-y-2">
                <CameraUpload
                  image={displayImage}
                  onImageCapture={handleUserImageCapture}
                  onReset={handleResetCapture}
                />
                {tryOnError && (
                  <p className="text-sm text-destructive">{tryOnError}</p>
                )}
              </div>

              {/* AI Search Panel (fills remaining space) */}
              <div className="flex-1 min-w-0">
                <AISearchPanel onReferenceReplace={handleReferenceReplace} />
              </div>
            </div>

            {/* Similar Garments Section */}
            <motion.div
              animate={shouldPulse ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`transition-opacity duration-300 ${isAnalyzing ? 'opacity-30' : 'opacity-100'}`}
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
