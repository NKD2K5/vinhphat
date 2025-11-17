import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get all query params
    const depth = searchParams.get('depth') || '1';
    const limit = searchParams.get('limit') || '100';
    const sort = searchParams.get('sort') || 'order';
    
    // Build query string
    const queryString = `depth=${depth}&limit=${limit}&sort=${sort}`;
    
    console.log(`📂 Fetching news categories from Payload: ${PAYLOAD_URL}/api/news-categories?${queryString}`);
    
    const response = await fetch(`${PAYLOAD_URL}/api/news-categories?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Payload API error:', errorText);
      return NextResponse.json(
        { docs: [], totalDocs: 0 },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.docs?.length || 0} news categories`);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('News Categories API error:', error);
    return NextResponse.json(
      { docs: [], totalDocs: 0, error: error.message },
      { status: 500 }
    );
  }
}
