import { NextRequest, NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        success: false, 
        message: 'Query must be at least 2 characters' 
      });
    }

    // Search products by name or description
    const response = await fetch(
      `${PAYLOAD_URL}/api/products?where[name][contains]=${encodeURIComponent(query)}&limit=${limit}&depth=1`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search products');
    }

    const data = await response.json();
    
    // Format product data for search suggestions
    const products = data.docs?.map((product: any) => {
      // Parse price from text format like "5.000đ/cái" to number
      let price = 0;
      if (product.price) {
        const priceMatch = product.price.match(/[\d,.]+/);
        if (priceMatch) {
          price = parseFloat(priceMatch[0].replace(/[,.]/g, ''));
        }
      }
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: price,
        priceText: product.price || 'Liên hệ',
        image: product.gallery?.[0]?.url || product.image || '/placeholder-image.jpg',
        category: product.service?.name || product.serviceCategory?.name || ''
      };
    }) || [];

    return NextResponse.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
