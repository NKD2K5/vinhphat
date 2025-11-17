import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET() {
  try {
    // Fetch all products to count by service
    const response = await fetch(`${PAYLOAD_URL}/api/products?limit=1000&depth=1`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // No cache during development
      // next: { revalidate: 60 }, // Cache for 1 minute in production
    });

    if (!response.ok) {
      console.error('Failed to fetch products for counting');
      return NextResponse.json({ counts: {} });
    }

    const data = await response.json();
    const products = data.docs || [];

    // Count products by service
    const counts: Record<string, number> = {};
    products.forEach((product: any) => {
      if (product.service) {
        const serviceId = typeof product.service === 'string' ? product.service : product.service.id;
        counts[serviceId] = (counts[serviceId] || 0) + 1;
      }
    });

    return NextResponse.json({ 
      counts,
      total: products.length,
    });
  } catch (error: any) {
    console.error('Error fetching product counts:', error);
    return NextResponse.json(
      { counts: {}, error: error.message },
      { status: 500 }
    );
  }
}
