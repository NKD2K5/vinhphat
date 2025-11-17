import { Config } from 'payload/config';
import { uploadToCloudinary, deleteFromCloudinary } from './upload';
import { CLOUDINARY_FOLDERS } from './cloudinary-config';

/**
 * Cloudinary Storage Adapter for Payload CMS
 * This replaces the default local file storage with Cloudinary
 */
export const cloudinaryAdapter = (collection: string) => {
  // Map collection names to Cloudinary folders
  const folderMap: Record<string, keyof typeof CLOUDINARY_FOLDERS> = {
    'products': 'products',
    'news': 'news',
    'posts': 'news',
    'banners': 'banners',
    'users': 'users',
    'media': 'media',
  };

  const folder = folderMap[collection.toLowerCase()] || 'general';

  return {
    name: 'cloudinary',
    
    // Handle file upload
    async handleUpload(req: any, file: any) {
      try {
        // Convert file buffer to base64
        const base64 = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
        
        // Upload to Cloudinary
        const result = await uploadToCloudinary(base64, { 
          folder,
          publicId: file.name.split('.')[0], // Use filename without extension
        });

        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }

        // Return the data in Payload's expected format
        return {
          filename: file.name,
          filesize: file.size,
          mimeType: file.mimetype,
          url: result.secureUrl,
          width: result.width,
          height: result.height,
          cloudinary: {
            publicId: result.publicId,
            format: result.format,
          },
        };
      } catch (error: any) {
        console.error('Cloudinary upload error:', error);
        throw error;
      }
    },

    // Handle file deletion
    async handleDelete(doc: any) {
      try {
        if (doc.cloudinary?.publicId) {
          await deleteFromCloudinary(doc.cloudinary.publicId);
        }
      } catch (error) {
        console.error('Cloudinary delete error:', error);
      }
    },

    // Generate static URL
    staticURL: '',
    
    // Disable local storage
    disableLocalStorage: true,
  };
};
