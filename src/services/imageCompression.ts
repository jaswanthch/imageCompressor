import React from 'react';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';
import { ImageData, CompressedImage } from '../types/image';
import { CompressionIcon } from '../components/toast/ToastIcons';

export async function compressImages(imagesToCompress: ImageData[]): Promise<CompressedImage[]> {
  const toastId = toast.loading('Compressing your images... Please wait', {
    icon: React.createElement(CompressionIcon),
    className: 'compression-toast',
    description: 'Optimizing file size while maintaining quality'
  });

  try {
    const compressed = await Promise.all(
      imagesToCompress.map(async (image) => {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: image.quality || 0.5,
          alwaysKeepResolution: true,
        };

        const compressedFile = await imageCompression(image.file, options);
        return {
          id: image.id,
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
          size: compressedFile.size,
          originalSize: image.size,
          quality: image.quality,
        };
      })
    );

    const totalSaved = compressed.reduce((sum, img) => sum + (img.originalSize - img.size), 0);
    const savedInMB = (totalSaved / (1024 * 1024)).toFixed(2);
    
    toast.success('Compression complete!', {
      id: toastId,
      icon: React.createElement(CompressionIcon),
      className: 'compression-toast',
      description: `Saved ${savedInMB}MB of space across ${compressed.length} ${
        compressed.length === 1 ? 'image' : 'images'
      }`
    });

    return compressed;
  } catch (error) {
    toast.error('Compression failed', {
      id: toastId,
      icon: React.createElement(CompressionIcon),
      className: 'compression-toast',
      description: 'Unable to compress image. Please try again with a different image'
    });
    console.error('Error compressing images:', error);
    throw error;
  }
}