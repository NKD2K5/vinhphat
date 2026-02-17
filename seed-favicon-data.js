// Script to seed favicon data
const { default: fetch } = require('node-fetch');

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

// Default favicon URLs from Cloudinary
const faviconData = {
  favicon: {
    faviconUrl: "https://res.cloudinary.com/da21jhapz/image/upload/v1770639611/vinhphat/general/favicon_pdi2wv.ico",
    appleTouchIconUrl: "https://res.cloudinary.com/da21jhapz/image/upload/v1770639611/vinhphat/general/apple-touch-icon_pdi2wv.png", 
    favicon192: "https://res.cloudinary.com/da21jhapz/image/upload/v1770639611/vinhphat/general/favicon-192_pdi2wv.png",
    favicon512: "https://res.cloudinary.com/da21jhapz/image/upload/v1770639611/vinhphat/general/favicon-512_pdi2wv.png"
  }
};

async function seedFaviconData() {
  try {
    console.log('Updating favicon data...');
    
    const response = await fetch(`${PAYLOAD_URL}/api/globals/site-branding`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(faviconData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update favicon: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Favicon data updated successfully!');
    console.log('Updated data:', JSON.stringify(result.favicon, null, 2));
    
  } catch (error) {
    console.error('❌ Error updating favicon data:', error.message);
    process.exit(1);
  }
}

seedFaviconData();
