import JSZip from 'jszip';
import { CompressedImage } from '../types/image';

export async function downloadAsZip(images: CompressedImage[]) {
  const zip = new JSZip();
  
  // Add each image to the zip
  for (const image of images) {
    const response = await fetch(image.preview);
    const blob = await response.blob();
    zip.file(`compressed-${image.file.name}`, blob);
  }
  
  // Generate and download the zip
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'compressed-images.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}