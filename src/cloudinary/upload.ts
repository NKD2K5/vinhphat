import cloudinary, { CLOUDINARY_FOLDERS, CloudinaryFolder } from './cloudinary-config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Re-export CloudinaryFolder type
export type { CloudinaryFolder } from './cloudinary-config';

interface UploadOptions {
  folder?: CloudinaryFolder;
  publicId?: string;
  transformation?: any;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
}

interface UploadResult {
  success: boolean;
  url?: string;
  secureUrl?: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  error?: string;
}

/**
 * Upload file to Cloudinary
 * @param file - File path, base64 string, or buffer
 * @param options - Upload options including folder type
 */
export async function uploadToCloudinary(
  file: string | Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    const {
      folder = 'general',
      publicId,
      transformation,
      resourceType = 'auto',
    } = options;

    const uploadOptions: any = {
      folder: CLOUDINARY_FOLDERS[folder],
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    if (transformation) {
      uploadOptions.transformation = transformation;
    }

    const result: UploadApiResponse = await cloudinary.uploader.upload(
      file as string,
      uploadOptions
    );

    return {
      success: true,
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad' | 'limit';
    quality?: number | 'auto';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  } = {}
): string {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
  } = options;

  const transformation: any = {
    crop,
    quality,
    fetch_format: format,
  };

  if (width) transformation.width = width;
  if (height) transformation.height = height;
  if (gravity) transformation.gravity = gravity;

  return cloudinary.url(publicId, transformation);
}

/**
 * Upload multiple files to Cloudinary
 */
export async function uploadMultipleToCloudinary(
  files: (string | Buffer)[],
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadToCloudinary(file, options));
  return Promise.all(uploadPromises);
}
