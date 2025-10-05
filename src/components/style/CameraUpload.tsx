'use client';

import { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CameraUploadProps {
  onImageCapture: (imageUrl: string) => void;
}

export function CameraUpload({ onImageCapture }: CameraUploadProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCapturedImage(result);
        onImageCapture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    // In a real app, this would open the camera
    // For now, we'll trigger file upload
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6">
      <h3 className="mb-4">Upload Your Photo</h3>
      
      <div className="flex justify-start">
        <div className="w-full sm:max-w-xs">
          {capturedImage ? (
            <div className="space-y-4">
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-muted">
                <ImageWithFallback
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setCapturedImage(null)}
                className="w-full"
              >
                Reset
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="relative w-full aspect-[3/4] rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-6 p-6">
                <Button
                  onClick={handleCameraClick}
                  variant="outline"
                  className="w-full h-20"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="w-6 h-6" />
                    <span>Take Photo</span>
                  </div>
                </Button>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-20"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6" />
                    <span>Upload Image</span>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
