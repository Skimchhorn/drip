'use client';

import { Product } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ExternalLink } from 'lucide-react';
import { AnimatedButton } from './AnimatedButton';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';

interface ProductCarouselProps {
  products: Product[];
  onTryOn: (product: Product) => void;
  loadingProductId?: string;
}

export function ProductCarousel({ products, onTryOn, loadingProductId }: ProductCarouselProps) {
  return (
    <div className="space-y-4">
      <h3>Similar Garments</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square bg-muted">
                <ImageWithFallback
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2">
                  {product.brand}
                </Badge>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="line-clamp-2">{product.name}</h4>
                  <p className="mt-1">${product.price.toFixed(2)}</p>
                </div>

                <div className="space-y-2">
                  <AnimatedButton
                    onClick={() => onTryOn(product)}
                    loading={loadingProductId === product.id}
                    className="w-full"
                  >
                    🧥 Try On
                  </AnimatedButton>
                  
                  <a
                    href={product.retailerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View</span>
                    </motion.button>
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
