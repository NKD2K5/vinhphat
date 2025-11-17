import { MetadataRoute } from 'next'

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';
const SITE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://vinhphat-printing.com' 
  : 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/gioi-thieu`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/dich-vu`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/san-pham`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tin-tuc`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/lien-he`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Dynamic pages from CMS
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    // Fetch news articles
    const newsResponse = await fetch(`${PAYLOAD_API_URL}/api/news?limit=1000`, {
      cache: 'no-store'
    });
    
    if (newsResponse.ok) {
      const newsData = await newsResponse.json();
      const newsPages = newsData.docs.map((article: any) => ({
        url: `${SITE_URL}/tin-tuc/${article.slug || article.id}`,
        lastModified: new Date(article.updatedAt || article.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
      dynamicPages = [...dynamicPages, ...newsPages];
    }

    // Fetch products
    const productsResponse = await fetch(`${PAYLOAD_API_URL}/api/products?limit=1000`, {
      cache: 'no-store'
    });
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      const productPages = productsData.docs.map((product: any) => ({
        url: `${SITE_URL}/san-pham/${product.slug || product.id}`,
        lastModified: new Date(product.updatedAt || product.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
      dynamicPages = [...dynamicPages, ...productPages];
    }

    // Fetch service categories
    const categoriesResponse = await fetch(`${PAYLOAD_API_URL}/api/service-categories?limit=100`, {
      cache: 'no-store'
    });
    
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      const categoryPages = categoriesData.docs.map((category: any) => ({
        url: `${SITE_URL}/dich-vu/${category.slug}`,
        lastModified: new Date(category.updatedAt || category.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));
      dynamicPages = [...dynamicPages, ...categoryPages];
    }

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return [...staticPages, ...dynamicPages];
}
