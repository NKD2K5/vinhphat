import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// Folder mapping for different upload types
export const CLOUDINARY_FOLDERS = {
  products: 'vinhphat/products',
  news: 'vinhphat/news',
  banners: 'vinhphat/banners',
  users: 'vinhphat/users',
  media: 'vinhphat/media',
  general: 'vinhphat/general',
} as const;

export type CloudinaryFolder = keyof typeof CLOUDINARY_FOLDERS;
