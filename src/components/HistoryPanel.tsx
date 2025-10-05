import React from 'react';
import { X, Clock } from 'lucide-react';
import { ClothingItem } from './HomePage';

export interface HistoryPhoto {
  id: string;
  imageUrl: string  | undefined;

}

interface HistoryPhotosStackProps {
  photos: HistoryPhoto[];
  onRemove: (id: string) => void;
  onSelect: (photo: HistoryPhoto) => void;
}

export function HistoryPanel({ photos, onRemove, onSelect }: HistoryPhotosStackProps) {
  return (
    <div className="h-full flex flex-col p-6">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-[#6b5d4f] text-2xl mb-2">HISTORY</h2>
        <div className="h-1 w-20 bg-gradient-to-r from-[#b89968] to-transparent rounded-full" />
      </div>

      {/* Photo List */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {photos.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 text-center border-2 border-dashed border-[#c4b5a0] shadow-inner">
            <Clock className="w-12 h-12 text-[#b89968] mx-auto mb-3 opacity-50" />
            <p className="text-[#8b7355]">
              No generated photos yet
            </p>
            <p className="text-[#a89a8c] text-sm mt-2">
              Drag items to the mirror and click generate!
            </p>
          </div>
        ) : (
          photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => onSelect(photo)}
              className="group relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-[#e0d5c7] hover:scale-105"
              style={{
                animation: `slideInLeft 0.4s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#f5ebe0] to-[#e8dcc8]">
                <img
                  src={photo.imageUrl}
                  alt={`History ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info */}
              <div className="p-3 bg-gradient-to-r from-[#e8dcc8] to-[#f5ebe0] rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {/* Safely display the image */}
                    {photo.imageUrl ? (
                      <img
                        src={photo.imageUrl}
                        alt="History preview"
                        className="w-16 h-16 object-cover rounded-md border border-[#d8c8aa]"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#d8c8aa]/30 flex items-center justify-center text-[#6b5d4f] text-xs rounded-md">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* ID fallback */}
                  <div className="ml-4 text-right">
                    <p className="text-[#6b5d4f] text-xs font-medium">ID: {photo.id}</p>
                  </div>
                </div>
              </div>


              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(photo.id);
                }}
                className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(196, 181, 160, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #b89968;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a07d4d;
        }
      `}</style>
    </div>
  );
}
