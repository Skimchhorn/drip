'use client';

import { useState } from 'react';
import { TryOnHistory } from '../../lib/types';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Download, Share2, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

interface HistoryPanelProps {
  history: TryOnHistory[];
  onHistoryClick: (item: TryOnHistory) => void;
  onDelete: (id: string) => void;
}

export function HistoryPanel({ history, onHistoryClick, onDelete }: HistoryPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="mb-4">Try-On History</h3>
        <p className="text-muted-foreground text-center py-8">
          No try-ons yet. Start by selecting a garment!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4">Try-On History</h3>

      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative group cursor-pointer"
              onClick={() => onHistoryClick(item)}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                <ImageWithFallback
                  src={item.imageUrl}
                  alt={`Try-on ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Hover overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2"
                >
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download functionality
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Share functionality
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-white">${item.totalPrice.toFixed(2)}</p>
                </motion.div>
              </div>

              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

// Mobile version with drawer
export function HistoryDrawer({ history, onHistoryClick, onDelete }: HistoryPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          View History ({history.length})
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Try-On History</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <HistoryPanel
            history={history}
            onHistoryClick={onHistoryClick}
            onDelete={onDelete}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
