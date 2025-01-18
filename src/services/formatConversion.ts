import heic2any from 'heic2any';

export async function convertHeicToJpeg(file: File): Promise<File> {
  if (file.type === 'image/heic' || file.type === 'image/heif' || file.type === 'image/avif') {
    try {
      const jpegBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      }) as Blob;
      return new File([jpegBlob], file.name.replace(/\.(heic|heif|avif)$/i, '.jpg'), {
        type: 'image/jpeg'
      });
    } catch (error) {
      console.error('Error converting image:', error);
      throw new Error('Failed to convert image format');
    }
  }
  return file;
}