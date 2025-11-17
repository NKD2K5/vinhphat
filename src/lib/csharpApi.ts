// C# API Integration for VinhPhat
// API URL của project CTyInVinhPhat

const CSHARP_API_URL = process.env.NEXT_PUBLIC_CSHARP_API_URL || 'https://localhost:7118/api';

// ============================================
// PRODUCTS API
// ============================================

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export const ProductsAPI = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${CSHARP_API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  // Get product by ID
  getById: async (id: string): Promise<Product> => {
    const response = await fetch(`${CSHARP_API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  // Create product
  create: async (product: Product): Promise<Product> => {
    const response = await fetch(`${CSHARP_API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  // Update product
  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${CSHARP_API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${CSHARP_API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },
};

// ============================================
// NEWS API
// ============================================

export interface News {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  category: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const NewsAPI = {
  // Get all news
  getAll: async (): Promise<News[]> => {
    const response = await fetch(`${CSHARP_API_URL}/news`);
    if (!response.ok) throw new Error('Failed to fetch news');
    return response.json();
  },

  // Get news by ID
  getById: async (id: string): Promise<News> => {
    const response = await fetch(`${CSHARP_API_URL}/news/${id}`);
    if (!response.ok) throw new Error('Failed to fetch news');
    return response.json();
  },

  // Create news
  create: async (news: News): Promise<News> => {
    const response = await fetch(`${CSHARP_API_URL}/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(news),
    });
    if (!response.ok) throw new Error('Failed to create news');
    return response.json();
  },

  // Update news
  update: async (id: string, news: Partial<News>): Promise<News> => {
    const response = await fetch(`${CSHARP_API_URL}/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(news),
    });
    if (!response.ok) throw new Error('Failed to update news');
    return response.json();
  },

  // Delete news
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${CSHARP_API_URL}/news/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete news');
  },
};

// ============================================
// UPLOAD API (Cloudinary via C#)
// ============================================

export interface UploadResult {
  success: boolean;
  url?: string;
  secureUrl?: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  error?: string;
}

export const UploadAPI = {
  // Upload image to Cloudinary via C# API
  uploadImage: async (file: File, folder: string = 'general'): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch(`${CSHARP_API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    return response.json();
  },

  // Delete image from Cloudinary
  deleteImage: async (publicId: string): Promise<{ success: boolean }> => {
    const response = await fetch(`${CSHARP_API_URL}/upload/${encodeURIComponent(publicId)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }

    return response.json();
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
