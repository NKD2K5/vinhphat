import { NextResponse } from 'next/server';

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';
const CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

// Tắt cache cho route này
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  console.log('🌐 [HOME-PAGE API] Incoming request at /api/home-page');
  console.log('🌐 [HOME-PAGE API] Using PAYLOAD_API_URL =', PAYLOAD_API_URL);

  try {
    // Home page is now a global, not a collection
    console.log('➡️  [HOME-PAGE API] Fetching Payload Global: /api/globals/home-page?depth=2');
    const response = await fetch(`${PAYLOAD_API_URL}/api/globals/home-page?depth=2`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('❌ [HOME-PAGE API] Failed to fetch home page:', response.status, response.statusText);
      return NextResponse.json(
        { homePage: null },
        { status: 200, headers: CACHE_HEADERS }
      );
    }
    
    const homeGlobalData = await response.json();
    console.log('📦 [HOME-PAGE API] Home Global Data fetched');
    console.log('📦 [HOME-PAGE API] Raw Home Global Data (truncated):', JSON.stringify({
      title: homeGlobalData?.title,
      hasHero: !!homeGlobalData?.heroSection,
      hasAbout: !!homeGlobalData?.aboutSection,
      hasServices: !!homeGlobalData?.servicesSection,
      hasFeaturedProducts: !!homeGlobalData?.featuredProductsSection,
      hasWorkflow: !!homeGlobalData?.workflowSection,
      hasTestimonials: !!homeGlobalData?.testimonialsSection,
      hasLatestNews: !!homeGlobalData?.latestNewsSection,
      hasWhyChooseUs: !!homeGlobalData?.whyChooseUsSection,
    }, null, 2));
    
    // Helper: normalize richText or string to plain string
    const toPlain = (val: any): string => {
      if (!val) return '';
      if (typeof val === 'string') return val;
      if (Array.isArray(val)) return val.map((n: any) => (n?.text ? n.text : toPlain(n?.children))).join('');
      if (typeof val === 'object') return toPlain(val.text || val.children || val.content || val.description || val.title);
      return String(val ?? '');
    };
    
    // Chuyển đổi Home Global data thành layout format mà Next.js mong đợi
    const layout: any[] = [];
    
    // 1. Hero Section (chuẩn hóa slides về cùng schema mà FE kỳ vọng)
    if (homeGlobalData.heroSection) {
      console.log('🧩 [HOME-PAGE API] Mapping heroSection → blockType=hero');
      const rawSlides = Array.isArray(homeGlobalData.heroSection.slides)
        ? homeGlobalData.heroSection.slides
        : [];
      const normalizedSlides = rawSlides.map((s: any, idx: number) => {
        const bg = s?.backgroundImage;
        let bgUrl = bg;
        if (bg && typeof bg === 'object') {
          if (bg.url) bgUrl = bg.url;
          else if (bg.filename) bgUrl = `${PAYLOAD_API_URL}/media/${bg.filename}`;
        }
        const slide = {
          headline: toPlain(s?.headline) || toPlain(s?.title) || toPlain(s?.heading),
          subheadline: toPlain(s?.subheadline) || toPlain(s?.description),
          backgroundImage: bgUrl || null,
          backgroundColor: s?.backgroundColor || '#1e40af',
          // Hỗ trợ cả CTA và Button
          primaryButton: s?.primaryButton || s?.primaryCTA || null,
          secondaryButton: s?.secondaryButton || s?.secondaryCTA || null,
        };
        console.log(`   ▶️  [HOME-PAGE API] Hero slide #${idx + 1}:`, slide.headline);
        return slide;
      });
      
      layout.push({
        blockType: 'hero',
        slides: normalizedSlides,
        stats: Array.isArray(homeGlobalData.heroSection.stats) ? homeGlobalData.heroSection.stats : [],
      });
    }
    
    // 2. About Section → { blockType: 'about', title, primaryButton, secondaryButton }
    if (homeGlobalData.aboutSection) {
      console.log('🧩 [HOME-PAGE API] Mapping aboutSection → blockType=about');
      const about = homeGlobalData.aboutSection;
      layout.push({
        blockType: 'about',
        title: about.title,
        primaryButton: about.primaryButton,
        secondaryButton: about.secondaryButton,
      });
    }
    
    // 3. Services Section → { blockType: 'services', title, ctaText, ctaLink }
    if (homeGlobalData.servicesSection) {
      console.log('🧩 [HOME-PAGE API] Mapping servicesSection → blockType=services');
      // Populate service categories (giữ lại để FE có thêm dữ liệu nếu cần)
      let populatedCategories: any[] = [];
      if (homeGlobalData.servicesSection.categories) {
        console.log('   🔍 [HOME-PAGE API] servicesSection has', homeGlobalData.servicesSection.categories.length, 'categories');
        populatedCategories = await Promise.all(
          homeGlobalData.servicesSection.categories.map(async (categoryId: any, idx: number) => {
            if (typeof categoryId === 'object') {
              console.log(`   ✅ [HOME-PAGE API] servicesSection category #${idx + 1} already populated`);
              return categoryId;
            }
            
            try {
              const categoryRes = await fetch(`${PAYLOAD_API_URL}/api/service-categories/${categoryId}?depth=1`);
              if (categoryRes.ok) {
                const categoryData = await categoryRes.json();
                console.log('   ✅ [HOME-PAGE API] Fetched service category:', categoryData.name);
                return categoryData;
              }
              console.warn('   ⚠️  [HOME-PAGE API] Failed to fetch service category (non-200):', categoryId, categoryRes.status);
            } catch (err) {
              console.error('   ❌ [HOME-PAGE API] Failed to fetch service category:', categoryId, err);
            }
            return categoryId;
          })
        );
      }
      
      layout.push({
        blockType: 'services',
        title: homeGlobalData.servicesSection.title,
        categories: populatedCategories,
        ctaText: homeGlobalData.servicesSection.ctaButton?.text,
        ctaLink: homeGlobalData.servicesSection.ctaButton?.link,
      });
    }
    
    // 4. Why Choose Us Section → { blockType: 'whyChooseUs', title, reasons }
    if (homeGlobalData.whyChooseUsSection) {
      console.log('🧩 [HOME-PAGE API] Mapping whyChooseUsSection → blockType=whyChooseUs');
      layout.push({
        blockType: 'whyChooseUs',
        title: homeGlobalData.whyChooseUsSection.title,
        reasons: homeGlobalData.whyChooseUsSection.reasons,
      });
    }
    
    // 5. Workflow Section → { blockType: 'workflow', title, steps }
    if (homeGlobalData.workflowSection) {
      console.log('🧩 [HOME-PAGE API] Mapping workflowSection → blockType=workflow');
      layout.push({
        blockType: 'workflow',
        title: homeGlobalData.workflowSection.title,
        steps: homeGlobalData.workflowSection.steps,
      });
    }
    
    // 6. Featured Products Section → { blockType: 'featuredProducts', title, products, ctaText, ctaLink }
    if (homeGlobalData.featuredProductsSection) {
      console.log('🧩 [HOME-PAGE API] Mapping featuredProductsSection → blockType=featuredProducts');
      // Populate products
      let populatedProducts: any[] = [];
      if (homeGlobalData.featuredProductsSection.products) {
        console.log('   � [HOME-PAGE API] featuredProductsSection has', homeGlobalData.featuredProductsSection.products.length, 'products');
        populatedProducts = await Promise.all(
          homeGlobalData.featuredProductsSection.products.map(async (productId: any, idx: number) => {
            if (typeof productId === 'object') {
              console.log(`   ✅ [HOME-PAGE API] featured product #${idx + 1} already populated`);
              return productId;
            }
            
            try {
              const productRes = await fetch(`${PAYLOAD_API_URL}/api/products/${productId}?depth=2`);
              if (productRes.ok) {
                const productData = await productRes.json();
                console.log('   ✅ [HOME-PAGE API] Fetched product:', productData.name, 'Image:', productData.image?.filename);
                return productData;
              }
            } catch (err) {
              console.error('   ❌ [HOME-PAGE API] Failed to fetch product:', productId, err);
            }
            return productId;
          })
        );
      }
      
      layout.push({
        blockType: 'featuredProducts',
        title: homeGlobalData.featuredProductsSection.title,
        products: populatedProducts,
        ctaText: homeGlobalData.featuredProductsSection.ctaButton?.text,
        ctaLink: homeGlobalData.featuredProductsSection.ctaButton?.link,
      });
    }
    
    // 7. Testimonials Section → { blockType: 'testimonials', title, testimonials }
    if (homeGlobalData.testimonialsSection) {
      console.log('🧩 [HOME-PAGE API] Mapping testimonialsSection → blockType=testimonials');
      layout.push({
        blockType: 'testimonials',
        title: homeGlobalData.testimonialsSection.title,
        testimonials: homeGlobalData.testimonialsSection.testimonials,
      });
    }
    
    // 8. Latest News Section → { blockType: 'latestNews', title, posts, ctaText, ctaLink }
    if (homeGlobalData.latestNewsSection) {
      console.log('🧩 [HOME-PAGE API] Mapping latestNewsSection → blockType=latestNews');
      // Populate news posts
      let populatedPosts: any[] = [];
      if (homeGlobalData.latestNewsSection.posts) {
        console.log('   🔍 [HOME-PAGE API] latestNewsSection has', homeGlobalData.latestNewsSection.posts.length, 'posts');
        populatedPosts = await Promise.all(
          homeGlobalData.latestNewsSection.posts.map(async (postId: any, idx: number) => {
            if (typeof postId === 'object') {
              console.log(`   ✅ [HOME-PAGE API] latest news post #${idx + 1} already populated`);
              return postId;
            }
            
            try {
              const postRes = await fetch(`${PAYLOAD_API_URL}/api/news/${postId}?depth=2`);
              if (postRes.ok) {
                const postData = await postRes.json();
                console.log('   ✅ [HOME-PAGE API] Fetched news:', postData.title, 'Image:', postData.featuredImage?.filename || postData.image?.filename);
                return postData;
              }
              console.warn('   ⚠️  [HOME-PAGE API] Failed to fetch news (non-200):', postId, postRes.status);
            } catch (err) {
              console.error('   ❌ [HOME-PAGE API] Failed to fetch news:', postId, err);
            }
            return postId;
          })
        );
      }
      
      layout.push({
        blockType: 'latestNews',
        title: homeGlobalData.latestNewsSection.title,
        posts: populatedPosts,
        ctaText: homeGlobalData.latestNewsSection.ctaButton?.text,
        ctaLink: homeGlobalData.latestNewsSection.ctaButton?.link,
      });
    }
    
    // Tạo homePage object với layout
    const homePage = {
      title: homeGlobalData.title,
      seo: homeGlobalData.seo,
      layout: layout,
    };
    
    console.log('📋 [HOME-PAGE API] Converted to layout format with', layout.length, 'blocks');
    if (layout.length > 0) {
      console.log('📦 [HOME-PAGE API] Sample first block:', JSON.stringify(layout[0], null, 2));
    } else {
      console.warn('⚠️  [HOME-PAGE API] Layout array is empty');
    }
    
    return NextResponse.json(
      { homePage },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error('❌ [HOME-PAGE API] Error fetching or mapping home page:', error);
    return NextResponse.json(
      { homePage: null },
      { status: 200, headers: CACHE_HEADERS }
    );
  }
}
