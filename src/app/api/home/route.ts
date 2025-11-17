import { NextResponse } from 'next/server';

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

// Tắt cache cho route này
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch home page data - không cache
    const homeRes = await fetch(`${PAYLOAD_API_URL}/api/home-page`, {
      cache: 'no-store',
    });
    
    if (!homeRes.ok) {
      throw new Error('Failed to fetch home page data');
    }
    
    const homeData = await homeRes.json();
    
    // Fetch featured products - không cache
    const productsRes = await fetch(`${PAYLOAD_API_URL}/api/products?where[isFeatured][equals]=true&limit=5`, {
      cache: 'no-store',
    });
    
    const productsData = await productsRes.json();
    
    // Fetch reviews - không cache
    const reviewsRes = await fetch(`${PAYLOAD_API_URL}/api/reviews?limit=4&sort=-date`, {
      cache: 'no-store',
    });
    
    const reviewsData = await reviewsRes.json();
    
    // Fetch news - không cache
    const newsRes = await fetch(`${PAYLOAD_API_URL}/api/news?limit=5&sort=-publishedAt`, {
      cache: 'no-store',
    });
    
    const newsData = await newsRes.json();
    
    // Fetch services - không cache
    const servicesRes = await fetch(`${PAYLOAD_API_URL}/api/services?sort=order`, {
      cache: 'no-store',
    });
    
    const servicesData = await servicesRes.json();
    
    // Fetch process steps - không cache
    const processRes = await fetch(`${PAYLOAD_API_URL}/api/process-steps?sort=order`, {
      cache: 'no-store',
    });
    
    const processData = await processRes.json();
    
    // Fetch why choose us - không cache
    const whyChooseUsRes = await fetch(`${PAYLOAD_API_URL}/api/why-choose-us?sort=order`, {
      cache: 'no-store',
    });
    
    const whyChooseUsData = await whyChooseUsRes.json();
    
    return NextResponse.json({
      homePage: homeData.docs?.[0] || null,
      featuredProducts: productsData.docs || [],
      reviews: reviewsData.docs || [],
      news: newsData.docs || [],
      services: servicesData.docs || [],
      processSteps: processData.docs || [],
      whyChooseUs: whyChooseUsData.docs || [],
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home data' },
      { status: 500 }
    );
  }
}
