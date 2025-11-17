import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let categoriesResponse;
    try {
      // Fetch service categories
      categoriesResponse = await fetch(`${PAYLOAD_URL}/api/service-categories?sort=order&limit=100`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
    } catch (fetchError) {
      // Payload CMS server is not running
      console.log('Payload CMS server not running, using fallback data');
      return NextResponse.json({
        success: true,
        categories: [],
        totalCategories: 0,
        totalServices: 0,
        message: 'CMS server not running - using fallback data',
      });
    }

    // If categories collection doesn't exist yet, return empty data
    if (!categoriesResponse.ok) {
      console.log('Service categories collection not found or empty');
      return NextResponse.json({
        success: true,
        categories: [],
        totalCategories: 0,
        totalServices: 0,
        message: 'Collections not initialized yet',
      });
    }

    const categoriesData = await categoriesResponse.json();
    
    // Fetch services
    let servicesUrl = `${PAYLOAD_URL}/api/service-items?sort=order&limit=100&where[isActive][equals]=true`;
    if (category) {
      servicesUrl += `&where[category][equals]=${category}`;
    }
    
    const servicesResponse = await fetch(servicesUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    // If services collection doesn't exist yet, return empty data
    if (!servicesResponse.ok) {
      console.log('Services collection not found or empty');
      return NextResponse.json({
        success: true,
        categories: [],
        totalCategories: 0,
        totalServices: 0,
        message: 'Collections not initialized yet',
      });
    }

    const servicesData = await servicesResponse.json();

    // Group services by category
    const categories = categoriesData.docs
      .filter((cat: any) => cat.isActive)
      .map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        order: cat.order,
        subcategories: servicesData.docs
          .filter((service: any) => service.category === cat.slug)
          .map((service: any) => ({
            id: service.id,
            name: service.name,
            slug: service.slug,
            description: service.description,
            image: service.image?.url || service.image,
            category: service.category,
            order: service.order,
            isFeatured: service.isFeatured,
          })),
      }));

    return NextResponse.json({
      success: true,
      categories,
      totalCategories: categories.length,
      totalServices: servicesData.docs.length,
    });
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch services',
      },
      { status: 500 }
    );
  }
}
