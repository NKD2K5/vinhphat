import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get all query params
    const depth = searchParams.get('depth') || '2';
    const limit = searchParams.get('limit') || '100';
    const page = searchParams.get('page') || '1';
    
    // Build query string with all params
    let queryString = `depth=${depth}&limit=${limit}&page=${page}`;
    
    // Add filter params if present
    const serviceFilter = searchParams.get('where[service][equals]');
    if (serviceFilter) {
      queryString += `&where[service][equals]=${serviceFilter}`;
    }
    
    const nameFilter = searchParams.get('where[name][contains]');
    if (nameFilter) {
      queryString += `&where[name][contains]=${encodeURIComponent(nameFilter)}`;
    }
    
    const slugFilter = searchParams.get('where[slug][equals]');
    if (slugFilter) {
      queryString += `&where[slug][equals]=${encodeURIComponent(slugFilter)}`;
    }
    
    const slugNotEquals = searchParams.get('where[slug][not_equals]');
    if (slugNotEquals) {
      queryString += `&where[slug][not_equals]=${encodeURIComponent(slugNotEquals)}`;
    }
    
    const response = await fetch(`${PAYLOAD_URL}/api/products?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch products:', response.status);
      return NextResponse.json(
        { docs: [], totalDocs: 0 },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { docs: [], totalDocs: 0, error: error.message },
      { status: 500 }
    );
  }
}
