// This file uses the Payload namespace from '@/types/payload-types'

/**
 * Get the full URL for an image from Payload CMS
 * @param image - The image object or ID from Payload
 * @param baseUrl - The base URL of your Payload instance (default: process.env.NEXT_PUBLIC_PAYLOAD_URL)
 * @returns The full image URL or an empty string if no image is provided
 */
export function getImageUrl(
  image: Payload.Media | string | null | undefined,
  baseUrl: string = process.env.NEXT_PUBLIC_PAYLOAD_URL || ''
): string {
  if (!image) return '';
  
  // If it's a string, assume it's an ID
  if (typeof image === 'string') {
    return `${baseUrl}/media/${image}`;
  }
  
  // If it's an object with a filename
  if (image.filename) {
    return `${baseUrl}/media/${image.filename}`;
  }
  
  // If it's an object with a url (already a full URL)
  if (image.url) {
    return image.url;
  }
  
  return '';
}

/**
 * Get optimized image URL with optional transformations
 */
export function getOptimizedImageUrl(
  image: Payload.Media | string | null | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png' | 'avif' | 'gif' | 'svg';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    position?: 'top' | 'right top' | 'right' | 'right bottom' | 'bottom' | 'left bottom' | 'left' | 'left top' | 'center';
  } = {}
): string {
  const baseUrl = getImageUrl(image);
  if (!baseUrl) return '';

  const params = new URLSearchParams();
  
  if (options.width) params.set('width', options.width.toString());
  if (options.height) params.set('height', options.height.toString());
  if (options.quality) params.set('quality', options.quality.toString());
  if (options.format) params.set('format', options.format);
  if (options.fit) params.set('fit', options.fit);
  if (options.position) params.set('position', options.position);
  
  return params.toString() ? `${baseUrl}?${params}` : baseUrl;
}

/**
 * Get image dimensions from a URL or file
 */
export async function getImageDimensions(
  src: string | File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    
    if (src instanceof File) {
      const url = URL.createObjectURL(src);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      img.src = url;
    } else {
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = src;
    }
    
    // Fallback in case image fails to load
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
  });
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Validate if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Convert a file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
