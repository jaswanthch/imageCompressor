export interface ImageData {
  id: string;
  file: File;
  preview: string;
  size: number;
  quality?: number;
}

export interface CompressedImage extends ImageData {
  originalSize: number;
}