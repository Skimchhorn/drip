'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';

interface TryOnCanvasProps {
  userImage: string;
  tryOnResult: string | null;
}

export function TryOnCanvas({ userImage, tryOnResult }: TryOnCanvasProps) {
  const [brightness, setBrightness] = useState(100);
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [showBefore, setShowBefore] = useState(false);

  const imageToDisplay = tryOnResult || userImage;

  return (
    <Card className="p-6">
      <h3 className="mb-4">Virtual Try-On</h3>

      {/* Canvas */}
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-muted mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={showBefore ? 'before' : 'after'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <ImageWithFallback
              src={showBefore ? userImage : imageToDisplay}
              alt="Try-on result"
              className="w-full h-full object-cover"
              style={{
                filter: `brightness(${brightness}%)`,
                transform: `scale(${scale / 100}) rotate(${rotation}deg)`,
                opacity: opacity / 100,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {tryOnResult && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Button
              variant="secondary"
              onClick={() => setShowBefore(!showBefore)}
              className="backdrop-blur-sm bg-white/90"
            >
              {showBefore ? 'Show After' : 'Show Before'}
            </Button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <Label>Brightness: {brightness}%</Label>
          <Slider
            value={[brightness]}
            onValueChange={(value) => setBrightness(value[0])}
            min={50}
            max={150}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Scale: {scale}%</Label>
          <Slider
            value={[scale]}
            onValueChange={(value) => setScale(value[0])}
            min={50}
            max={150}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Rotation: {rotation}°</Label>
          <Slider
            value={[rotation]}
            onValueChange={(value) => setRotation(value[0])}
            min={-45}
            max={45}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Opacity: {opacity}%</Label>
          <Slider
            value={[opacity]}
            onValueChange={(value) => setOpacity(value[0])}
            min={0}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setBrightness(100);
            setScale(100);
            setRotation(0);
            setOpacity(100);
          }}
          className="w-full"
        >
          Reset Controls
        </Button>
      </div>
    </Card>
  );
}
