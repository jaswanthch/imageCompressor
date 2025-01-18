import React, { useState, useCallback } from 'react';
import { Upload, Download, Trash2, Archive } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { CompressionControls } from './components/CompressionControls';
import { ImageGrid } from './components/ImageGrid';
import { compressImages } from './services/imageCompression';
import { downloadAsZip } from './services/zipDownload';
import { convertHeicToJpeg } from './services/formatConversion';
import { formatSize, generateUniqueId } from './utils/files';
import type { ImageData, CompressedImage } from './types/image';

function App() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.type === 'image/heic' || file.type === 'image/heif' || file.type === 'image/avif'
    );
    if (files.length > 0) {
      await processImages(files);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await processImages(files);
    }
  }, []);

  const processImages = async (files: File[]) => {
    try {
      const processedFiles = await Promise.all(files.map(convertHeicToJpeg));
      const newImages = await Promise.all(processedFiles.map(async (file) => ({
        id: generateUniqueId(),
        file,
        preview: URL.createObjectURL(file),
        size: file.size,
        quality: 0.5,
      })));

      setImages(prev => [...prev, ...newImages]);
      const compressed = await compressImages(newImages);
      setCompressedImages(prev => [...prev, ...compressed]);
    } catch (error) {
      console.error('Error processing images:', error);
    }
  };

  const handleQualityChange = async (newQuality: number) => {
    if (!selectedImage) return;

    const imageToUpdate = images.find(img => img.id === selectedImage);
    if (!imageToUpdate) return;

    const updatedImage = { ...imageToUpdate, quality: newQuality };
    setImages(prev => prev.map(img => img.id === selectedImage ? updatedImage : img));
    setIsCompressing(true);
    try {
      const compressed = await compressImages([updatedImage]);
      setCompressedImages(prev => {
        const updatedImages = [...prev];
        compressed.forEach(newImage => {
          const index = updatedImages.findIndex(img => img.id === newImage.id);
          if (index !== -1) {
            URL.revokeObjectURL(updatedImages[index].preview);
            updatedImages[index] = newImage;
          }
        });
        return updatedImages;
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownloadAll = useCallback(() => {
    compressedImages.forEach(image => {
      const link = document.createElement('a');
      link.href = image.preview;
      link.download = `compressed-${image.file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }, [compressedImages]);

  const handleDownloadZip = useCallback(async () => {
    try {
      await downloadAsZip(compressedImages);
      toast.success('ZIP file downloaded successfully');
    } catch (error) {
      toast.error('Failed to create ZIP file');
      console.error('Error creating ZIP:', error);
    }
  }, [compressedImages]);

  const handleClearAll = useCallback(() => {
    images.forEach(image => URL.revokeObjectURL(image.preview));
    compressedImages.forEach(image => {
      URL.revokeObjectURL(image.preview);
    });
    
    setImages([]);
    setCompressedImages([]);
    setSelectedImage(null);
  }, [images, compressedImages]);

  const calculateTotalReduction = () => {
    if (compressedImages.length === 0) return 0;
    const totalOriginal = compressedImages.reduce((sum, img) => sum + img.originalSize, 0);
    const totalCompressed = compressedImages.reduce((sum, img) => sum + img.size, 0);
    return ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const selectedCompressedImage = selectedImage 
    ? compressedImages.find(img => img.id === selectedImage)
    : null;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#1E1E1E] px-6 py-6">
      <div className="max-w-6xl mx-auto pt-16">
        <Toaster 
          theme="dark" 
          position="top-right"
          closeButton
          richColors
        />
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">CMD Image Compressor</h1>
          <p className="text-gray-400">Compress multiple images with ease</p>
          <p className="text-gray-400 text-sm mt-2">Supports JPG, PNG, WebP, HEIC, and AVIF formats</p>
        </header>

        <div className="bg-[#2D2D2D] rounded-2xl shadow-xl p-8">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive ? 'border-[#00A3FF] bg-[#00A3FF]/10' : 'border-gray-600'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <Upload className="w-12 h-12 text-gray-400" />
              <div className="space-y-2">
                <p className="text-xl font-medium text-gray-200">
                  Drag and drop your images here
                </p>
                <p className="text-gray-400">or</p>
                <label className="inline-block">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.heic,.heif,.avif"
                    multiple
                    onChange={handleFileSelect}
                  />
                  <span className="px-4 py-2 bg-[#00A3FF] text-white rounded-lg cursor-pointer hover:bg-[#0088FF] transition-colors">
                    Browse Files
                  </span>
                </label>
              </div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="mt-8">
              {selectedImage && (
                <div className="sticky top-20 z-10 bg-[#2D2D2D] p-4 rounded-lg shadow-lg mb-8">
                  <CompressionControls
                    quality={images.find(img => img.id === selectedImage)?.quality || 0.5}
                    onQualityChange={handleQualityChange}
                  />
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>

              <ImageGrid
                images={compressedImages}
                onSelect={setSelectedImage}
                selectedId={selectedImage}
                formatSize={formatSize}
              />

              {compressedImages.length > 0 && (
                <div className="flex flex-col items-center gap-4 p-6 bg-[#1E1E1E] rounded-xl">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#00A3FF]">
                      {calculateTotalReduction()}% Total Reduction
                    </p>
                    <p className="text-gray-400">
                      {compressedImages.length} images compressed
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleDownloadAll}
                      className="flex items-center gap-2 px-6 py-3 bg-[#00A3FF] text-white rounded-lg hover:bg-[#0088FF] transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Download All Files
                    </button>
                    <button
                      onClick={handleDownloadZip}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Archive className="w-5 h-5" />
                      Download as ZIP
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}

export default App;