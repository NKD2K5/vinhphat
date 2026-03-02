const path = require('path');
const { pathToFileURL } = require('url');

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001';

const pickBlock = (layout, blockType) => (Array.isArray(layout) ? layout.find((b) => b?.blockType === blockType) : null);

const truncate = (value, max) => {
  if (value == null) return '';
  const str = String(value);
  if (str.length <= max) return str;
  return str.slice(0, max);
};

const stripHtml = (value) => {
  if (value == null) return '';
  const str = String(value);
  return str
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const pickAnyBlock = (layout, blockTypes) => {
  if (!Array.isArray(blockTypes)) return null;
  for (const t of blockTypes) {
    const b = pickBlock(layout, t);
    if (b) return b;
  }
  return null;
};

async function loadHomePageData() {
  // Prefer using root seed file (CommonJS) so we don't need to keep a frontend data file.
  const seedFilePath = path.resolve(__dirname, '../seed-home-data.js');
  try {
    // seed-home-data.js exports the object via module.exports
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const seedData = require(seedFilePath);
    if (seedData && typeof seedData === 'object') return seedData;
  } catch (_) {
    // ignore and fallback
  }

  // Fallback: old location (ESM)
  const dataFilePath = path.resolve(__dirname, '../src/data/homePageData.js');
  const dataModule = await import(pathToFileURL(dataFilePath).href);
  return dataModule?.default || dataModule?.homePageData;
}

async function run() {
  const homePageData = await loadHomePageData();

  if (!homePageData || typeof homePageData !== 'object') {
    throw new Error('homePageData is missing or invalid. Checked seed-home-data.js (preferred) and src/data/homePageData.js (fallback).');
  }

  const layout = Array.isArray(homePageData.layout) ? homePageData.layout : [];

  const hero = pickBlock(layout, 'hero') || {};
  const about = pickAnyBlock(layout, ['about', 'aboutBlock']) || {};
  const services = pickBlock(layout, 'services') || {};
  const whyChooseUs = pickBlock(layout, 'whyChooseUs') || {};
  const workflow = pickBlock(layout, 'workflow') || {};
  const featuredProducts = pickBlock(layout, 'featuredProducts') || {};
  const testimonials = pickBlock(layout, 'testimonials') || {};
  const latestNews = pickBlock(layout, 'latestNews') || {};

  const payloadBody = {
    title: homePageData.title || 'Trang Chủ',
    seo: {
      metaTitle: truncate(homePageData.seo?.metaTitle || '', 60),
      metaDescription: truncate(homePageData.seo?.metaDescription || '', 160),
      metaKeywords: homePageData.seo?.metaKeywords || '',
      ogImage: homePageData.seo?.ogImage || '',
    },

    heroSection: {
      slides: Array.isArray(hero.slides)
        ? hero.slides.map((s) => {
            if (!s || typeof s !== 'object') return s;
            return {
              ...s,
              headline: stripHtml(s.headline),
              subheadline: stripHtml(s.subheadline),
            };
          })
        : [],
      stats: Array.isArray(hero.stats) ? hero.stats : [],
    },

    aboutSection: {
      title: about.title || 'VinhPhat Printing',
      description: about.description || '',
      image: about.image || '',
      primaryButton: about.primaryButton || { text: '', link: '' },
      secondaryButton: about.secondaryButton || { text: '', link: '' },
    },

    servicesSection: {
      title: services.title || '',
      description: services.description || '',
      categories: [],
      ctaButton: {
        text: services.ctaText || services.ctaButton?.text || '',
        link: services.ctaLink || services.ctaButton?.link || '',
      },
    },

    whyChooseUsSection: {
      title: whyChooseUs.title || '',
      reasons: Array.isArray(whyChooseUs.reasons) ? whyChooseUs.reasons : [],
    },

    workflowSection: {
      title: workflow.title || '',
      intro: workflow.intro || '',
      steps: Array.isArray(workflow.steps) ? workflow.steps : [],
    },

    featuredProductsSection: {
      title: featuredProducts.title || '',
      description: featuredProducts.description || '',
      products: [],
      ctaButton: {
        text: featuredProducts.ctaText || featuredProducts.ctaButton?.text || '',
        link: featuredProducts.ctaLink || featuredProducts.ctaButton?.link || '',
      },
    },

    testimonialsSection: {
      title: testimonials.title || '',
      testimonials: Array.isArray(testimonials.testimonials) ? testimonials.testimonials : [],
    },

    latestNewsSection: {
      title: latestNews.title || '',
      description: latestNews.description || '',
      posts: [],
      ctaButton: {
        text: latestNews.ctaText || latestNews.ctaButton?.text || '',
        link: latestNews.ctaLink || latestNews.ctaButton?.link || '',
      },
    },
  };

  const url = `${PAYLOAD_URL}/api/globals/home-page`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payloadBody),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update home-page global. Status ${res.status}. Body: ${text}`);
  }

  const json = await res.json();
  console.log('✅ Seeded Payload Global: home-page');
  console.log('🔗 Admin:', `${PAYLOAD_URL}/admin/globals/home-page`);
  console.log('📦 Result title:', json?.title);
}

run().catch((err) => {
  console.error('❌ import-home-data failed:', err);
  process.exitCode = 1;
});
