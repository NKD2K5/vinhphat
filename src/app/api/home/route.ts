import { NextResponse } from 'next/server';



const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';



// Tắt cache cho route này

export const dynamic = 'force-dynamic';

export const revalidate = 0;

export async function GET() {
  try {
    const safeJson = async <T,>(res: Response, fallback: T): Promise<T> => {
      if (!res.ok) return fallback;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return fallback;
      try {
        return (await res.json()) as T;
      } catch {
        return fallback;
      }
    };

    const serviceCategoriesRes = await fetch(`${PAYLOAD_API_URL}/api/service-categories?sort=order`, {
      cache: 'no-store',
    });
    const serviceCategoriesData = await safeJson<{ docs?: any[] }>(serviceCategoriesRes, { docs: [] });

    const homeRes = await fetch(`${PAYLOAD_API_URL}/api/globals/home-page?depth=2`, {
      cache: 'no-store',
    });
    const homeGlobal = await safeJson<any>(homeRes, null);

    const serviceCategoriesFallback = (serviceCategoriesData.docs || []).slice(0, 2).map((cat: any) => ({
      id: cat?.id,
      name: cat?.name,
      slug: cat?.slug,
      description: cat?.description,
      image: cat?.image,
      icon: cat?.icon,
      color: cat?.color,
    }));

    const cmsCategories = Array.isArray(homeGlobal?.servicesSection?.categories)
      ? homeGlobal.servicesSection.categories
      : [];

    const categories = cmsCategories.length > 0 ? cmsCategories : serviceCategoriesFallback;

    const layout = homeGlobal
      ? [
          {
            blockType: 'hero',
            slides: homeGlobal.heroSection?.slides || [],
            stats: homeGlobal.heroSection?.stats || [],
          },
          {
            blockType: 'services',
            title: homeGlobal.servicesSection?.title || 'Dịch Vụ In Ấn',
            description: homeGlobal.servicesSection?.description || '',
            categories,
            ctaText: homeGlobal.servicesSection?.ctaButton?.text,
            ctaLink: homeGlobal.servicesSection?.ctaButton?.link,
          },
          {
            blockType: 'featuredProducts',
            sectionId: 'featured-products',
            title: homeGlobal.featuredProductsSection?.title || 'Sản Phẩm Nổi Bật',
            description: homeGlobal.featuredProductsSection?.description || '',
            products: Array.isArray(homeGlobal.featuredProductsSection?.products)
              ? homeGlobal.featuredProductsSection.products
              : [],
            ctaText: homeGlobal.featuredProductsSection?.ctaButton?.text,
            ctaLink: homeGlobal.featuredProductsSection?.ctaButton?.link,
          },
          {
            blockType: 'workflow',
            title: homeGlobal.workflowSection?.title,
            intro: homeGlobal.workflowSection?.intro,
            steps: Array.isArray(homeGlobal.workflowSection?.steps) ? homeGlobal.workflowSection.steps : [],
          },
          {
            blockType: 'testimonials',
            title: homeGlobal.testimonialsSection?.title,
            testimonials: Array.isArray(homeGlobal.testimonialsSection?.testimonials)
              ? homeGlobal.testimonialsSection.testimonials
              : [],
          },
          {
            blockType: 'latestNews',
            sectionId: 'latest-news',
            title: homeGlobal.latestNewsSection?.title,
            description: homeGlobal.latestNewsSection?.description,
            posts: Array.isArray(homeGlobal.latestNewsSection?.posts) ? homeGlobal.latestNewsSection.posts : [],
            ctaText: homeGlobal.latestNewsSection?.ctaButton?.text,
            ctaLink: homeGlobal.latestNewsSection?.ctaButton?.link,
          },
          {
            blockType: 'whyChooseUs',
            title: homeGlobal.whyChooseUsSection?.title,
            reasons: Array.isArray(homeGlobal.whyChooseUsSection?.reasons) ? homeGlobal.whyChooseUsSection.reasons : [],
          },
        ]
      : [
          {
            blockType: 'hero',
            slides: [],
            stats: [],
          },
          {
            blockType: 'services',
            title: 'Dịch Vụ In Ấn',
            description: '',
            categories,
            ctaText: 'Xem Tất Cả Dịch Vụ',
            ctaLink: '/dich-vu',
          },
        ];

    const homePage = homeGlobal
      ? {
          title: homeGlobal.title,
          seo: homeGlobal.seo,
          layout: layout.filter((b: any) => {
            if (b?.blockType === 'featuredProducts') return Array.isArray(b.products) && b.products.length > 0;
            if (b?.blockType === 'workflow') return Array.isArray(b.steps) && b.steps.length > 0;
            if (b?.blockType === 'testimonials') return Array.isArray(b.testimonials) && b.testimonials.length > 0;
            if (b?.blockType === 'latestNews') return Array.isArray(b.posts) && b.posts.length > 0;
            if (b?.blockType === 'whyChooseUs') return Array.isArray(b.reasons) && b.reasons.length > 0;
            return true;
          }),
        }
      : {
          title: 'Trang Chủ - Vĩnh Phát Printing',
          layout,
        };

    const productsRes = await fetch(`${PAYLOAD_API_URL}/api/products?where[isFeatured][equals]=true&limit=5`, {
      cache: 'no-store',
    });
    const productsData = await safeJson<{ docs?: any[] }>(productsRes, { docs: [] });

    const reviewsRes = await fetch(`${PAYLOAD_API_URL}/api/reviews?limit=4&sort=-date`, {
      cache: 'no-store',
    });
    const reviewsData = await safeJson<{ docs?: any[] }>(reviewsRes, { docs: [] });

    const newsRes = await fetch(`${PAYLOAD_API_URL}/api/news?limit=5&sort=-publishedAt`, {
      cache: 'no-store',
    });
    const newsData = await safeJson<{ docs?: any[] }>(newsRes, { docs: [] });

    const servicesRes = await fetch(`${PAYLOAD_API_URL}/api/service-items?sort=order`, {
      cache: 'no-store',
    });
    const servicesData = await safeJson<{ docs?: any[] }>(servicesRes, { docs: [] });

    return NextResponse.json({
      homePage,
      featuredProducts: productsData.docs || [],
      reviews: reviewsData.docs || [],
      news: newsData.docs || [],
      services: servicesData.docs || [],
      processSteps: [],
      whyChooseUs: [],
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json(

      { error: 'Failed to fetch home data' },

      { status: 500 }

    );

  }

}

