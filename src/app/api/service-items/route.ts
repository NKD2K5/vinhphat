import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    const isActive = searchParams.get('where[isActive][equals]');
    
    let url = `${PAYLOAD_URL}/api/service-items?limit=${limit}`;
    if (isActive) {
      url += `&where[isActive][equals]=${isActive}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch service items:', response.status);
      return NextResponse.json(
        { docs: [], totalDocs: 0 },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching service items:', error);
    return NextResponse.json(
      { docs: [], totalDocs: 0, error: error.message },
      { status: 500 }
    );
  }
}
