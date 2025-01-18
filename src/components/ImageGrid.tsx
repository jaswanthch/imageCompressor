import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ImageData {
  id: string;
  preview: string;
  size: number;
  originalSize: number;
}

interface ImageGridProps {
  images: ImageData[];
  onSelect: (id: string) => void;
  selectedId: string | null;
  formatSize: (bytes: number) => string;
}

export function ImageGrid({ images, onSelect, selectedId, formatSize }: ImageGridProps) {
  const calculateReduction = (original: number, compressed: number) => {
    return ((original - compressed) / original * 100).toFixed(1);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          onClick={() => onSelect(image.id)}
          className={`relative group rounded-lg overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
            selectedId === image.id ? 'ring-2 ring-[#00A3FF]' : ''
          }`}
        >
          <img
            src={image.preview}
            alt="Compressed preview"
            className="w-full aspect-video object-cover"
          />
          
          <div className="absolute bottom-0 inset-x-0 bg-black/80 text-white p-2 text-sm">
            <div className="flex items-center justify-between">
              <span>{formatSize(image.size)}</span>
              <span className="text-[#00A3FF]">
                -{calculateReduction(image.originalSize, image.size)}%
              </span>
            </div>
          </div>
          {selectedId === image.id && (
            <div className="absolute top-2 right-2 transition-transform duration-300">
              <CheckCircle2 className="w-6 h-6 text-[#00A3FF]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}