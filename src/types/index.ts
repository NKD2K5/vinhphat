// Type definitions for components

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  publishedAt: string;
  category: string;
  author: string;
}

export interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  reviewTitle: string;
  reviewText: string;
  productId: string;
  date: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number | string;
  image: string;
  category: string;
  rating: number;
  description: string;
  isFeatured: boolean;
}
