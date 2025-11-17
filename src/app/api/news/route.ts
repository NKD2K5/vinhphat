import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get all query params
    const depth = searchParams.get('depth') || '2';
    const limit = searchParams.get('limit') || '100';
    const page = searchParams.get('page') || '1';
    const sort = searchParams.get('sort') || '-publishedAt';
    
    // Build query string with all params
    let queryString = `depth=${depth}&limit=${limit}&page=${page}&sort=${sort}`;
    
    // Add filter params if present
    const categoryFilter = searchParams.get('where[category][equals]');
    if (categoryFilter) {
      queryString += `&where[category][equals]=${categoryFilter}`;
    }
    
    const slugFilter = searchParams.get('where[slug][equals]');
    if (slugFilter) {
      queryString += `&where[slug][equals]=${encodeURIComponent(slugFilter)}`;
    }

    const slugNotEquals = searchParams.get('where[slug][not_equals]');
    if (slugNotEquals) {
      queryString += `&where[slug][not_equals]=${encodeURIComponent(slugNotEquals)}`;
    }
    
    const titleFilter = searchParams.get('where[title][contains]');
    if (titleFilter) {
      queryString += `&where[title][contains]=${encodeURIComponent(titleFilter)}`;
    }

    const isFeaturedFilter = searchParams.get('where[isFeatured][equals]');
    if (isFeaturedFilter) {
      queryString += `&where[isFeatured][equals]=${isFeaturedFilter}`;
    }
    
    console.log(`📰 Fetching news from Payload: ${PAYLOAD_URL}/api/news?${queryString}`);
    
    const response = await fetch(`${PAYLOAD_URL}/api/news?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Payload API error:', errorText);
      return NextResponse.json(
        { docs: [], totalDocs: 0, totalPages: 0, page: 1 },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.docs?.length || 0} news articles`);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('News API error:', error);
    return NextResponse.json(
      { docs: [], totalDocs: 0, totalPages: 0, page: 1, error: error.message },
      { status: 500 }
    );
  }
}
