// Utility functions for managing recently viewed products

export interface RecentlyViewedProduct {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: string;
  viewedAt: number;
}

const STORAGE_KEY = 'vinhphat_recently_viewed';
const MAX_ITEMS = 8; // Maximum number of recently viewed products to store
const EXPIRY_DAYS = 1; // Number of days before items expire (1 day = 24 hours)

export const addToRecentlyViewed = (product: Omit<RecentlyViewedProduct, 'viewedAt'>): void => {
  if (typeof window === 'undefined') return;

  try {
    // Get existing items
    const existing = getRecentlyViewed();
    
    // Remove if already exists (to update timestamp)
    const filtered = existing.filter(item => item.id !== product.id);
    
    // Add new item at the beginning
    const updated = [
      { ...product, viewedAt: Date.now() },
      ...filtered
    ].slice(0, MAX_ITEMS); // Keep only MAX_ITEMS
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving to recently viewed:', error);
  }
};

export const getRecentlyViewed = (): RecentlyViewedProduct[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const items = JSON.parse(stored) as RecentlyViewedProduct[];
    
    // Filter out items older than EXPIRY_DAYS
    const expiryTime = Date.now() - (EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const filtered = items.filter(item => item.viewedAt > expiryTime);
    
    // Update storage if items were filtered
    if (filtered.length !== items.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
    
    return filtered;
  } catch (error) {
    console.error('Error reading recently viewed:', error);
    return [];
  }
};

export const clearRecentlyViewed = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
  }
};
