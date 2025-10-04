'use client';

import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadPhotoBoxProps {
  uploadedImage?: string;
  onImageUpload?: (image: string) => void;
}

export function UploadPhotoBox({ uploadedImage, onImageUpload }: UploadPhotoBoxProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload?.(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload?.(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-[#d4b896] to-[#c4a87c] rounded-lg p-6 shadow-inner">
      <div
        className={`relative bg-[#f5ebe0] rounded border-2 ${
          dragOver ? 'border-[#8b7355]' : 'border-[#c4b5a0]'
        } border-dashed h-96 flex flex-col items-center justify-center transition-colors`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploadedImage ? (
          <ImageWithFallback
            src={uploadedImage}
            alt="Uploaded"
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <>
            <ImageIcon className="w-16 h-16 text-[#c4b5a0] mb-4" />
            <p className="text-[#8b7355] mb-4">UPLOAD PHOTO</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-6 py-2 bg-[#b89968] text-white rounded cursor-pointer hover:bg-[#a68858] transition-colors"
            >
              Choose File
            </label>
          </>
        )}
      </div>
    </div>
  );
}