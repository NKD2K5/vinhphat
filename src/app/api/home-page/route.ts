import { NextResponse } from 'next/server';

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

// Tắt cache cho route này
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Home page is now a global, not a collection
    const response = await fetch(`${PAYLOAD_API_URL}/api/globals/home-page?depth=2`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch home page:', response.status, response.statusText);
      return NextResponse.json(
        { homePage: null },
        { status: 200 }
      );
    }
    
    const homeGlobalData = await response.json();
    console.log('📦 Home Global Data:', JSON.stringify(homeGlobalData, null, 2));
    
    // Chuyển đổi Home Global data thành layout format mà Next.js mong đợi
    const layout = [];
    
    // 1. Hero Section
    if (homeGlobalData.heroSection) {
      layout.push({
        blockType: 'hero',
        ...homeGlobalData.heroSection
      });
    }
    
    // 2. About Section
    if (homeGlobalData.aboutSection) {
      layout.push({
        blockType: 'about',
        ...homeGlobalData.aboutSection
      });
    }
    
    // 3. Services Section
    if (homeGlobalData.servicesSection) {
      // Populate service categories
      let populatedCategories = [];
      if (homeGlobalData.servicesSection.categories) {
        populatedCategories = await Promise.all(
          homeGlobalData.servicesSection.categories.map(async (categoryId: any) => {
            if (typeof categoryId === 'object') return categoryId;
            
            try {
              const categoryRes = await fetch(`${PAYLOAD_API_URL}/api/service-categories/${categoryId}?depth=1`);
              if (categoryRes.ok) {
                const categoryData = await categoryRes.json();
                console.log('✅ Fetched service category:', categoryData.name);
                return categoryData;
              }
            } catch (err) {
              console.error('Failed to fetch service category:', categoryId, err);
            }
            return categoryId;
          })
        );
      }
      
      layout.push({
        blockType: 'services',
        ...homeGlobalData.servicesSection,
        categories: populatedCategories
      });
    }
    
    // 4. Why Choose Us Section
    if (homeGlobalData.whyChooseUsSection) {
      layout.push({
        blockType: 'whyChooseUs',
        ...homeGlobalData.whyChooseUsSection
      });
    }
    
    // 5. Workflow Section
    if (homeGlobalData.workflowSection) {
      layout.push({
        blockType: 'workflow',
        ...homeGlobalData.workflowSection
      });
    }
    
    // 6. Featured Products Section
    if (homeGlobalData.featuredProductsSection) {
      // Populate products
      let populatedProducts = [];
      if (homeGlobalData.featuredProductsSection.products) {
        console.log('🛍️ Found featuredProducts section with', homeGlobalData.featuredProductsSection.products.length, 'products');
        populatedProducts = await Promise.all(
          homeGlobalData.featuredProductsSection.products.map(async (productId: any) => {
            if (typeof productId === 'object') return productId;
            
            try {
              const productRes = await fetch(`${PAYLOAD_API_URL}/api/products/${productId}?depth=2`);
              if (productRes.ok) {
                const productData = await productRes.json();
                console.log('✅ Fetched product:', productData.name, 'Image:', productData.image?.filename);
                return productData;
              }
            } catch (err) {
              console.error('Failed to fetch product:', productId, err);
            }
            return productId;
          })
        );
      }
      
      layout.push({
        blockType: 'featuredProducts',
        title: homeGlobalData.featuredProductsSection.title,
        description: homeGlobalData.featuredProductsSection.description,
        products: populatedProducts,
        ctaText: homeGlobalData.featuredProductsSection.ctaButton?.text,
        ctaLink: homeGlobalData.featuredProductsSection.ctaButton?.link
      });
    }
    
    // 7. Testimonials Section
    if (homeGlobalData.testimonialsSection) {
      layout.push({
        blockType: 'testimonials',
        ...homeGlobalData.testimonialsSection
      });
    }
    
    // 8. Latest News Section
    if (homeGlobalData.latestNewsSection) {
      // Populate news posts
      let populatedPosts = [];
      if (homeGlobalData.latestNewsSection.posts) {
        populatedPosts = await Promise.all(
          homeGlobalData.latestNewsSection.posts.map(async (postId: any) => {
            if (typeof postId === 'object') return postId;
            
            try {
              const postRes = await fetch(`${PAYLOAD_API_URL}/api/news/${postId}?depth=2`);
              if (postRes.ok) {
                const postData = await postRes.json();
                console.log('✅ Fetched news:', postData.title, 'Image:', postData.featuredImage?.filename || postData.image?.filename);
                return postData;
              }
            } catch (err) {
              console.error('Failed to fetch news:', postId, err);
            }
            return postId;
          })
        );
      }
      
      layout.push({
        blockType: 'latestNews',
        title: homeGlobalData.latestNewsSection.title,
        description: homeGlobalData.latestNewsSection.description,
        posts: populatedPosts,
        ctaText: homeGlobalData.latestNewsSection.ctaButton?.text,
        ctaLink: homeGlobalData.latestNewsSection.ctaButton?.link
      });
    }
    
    // Tạo homePage object với layout
    const homePage = {
      title: homeGlobalData.title,
      seo: homeGlobalData.seo,
      layout: layout
    };
    
    console.log('📋 Converted to layout format with', layout.length, 'blocks');
    console.log('📦 Sample block:', JSON.stringify(layout[0], null, 2));
    
    return NextResponse.json({
      homePage,
    });
  } catch (error) {
    console.error('Error fetching home page:', error);
    return NextResponse.json(
      { homePage: null },
      { status: 200 }
    );
  }
}
