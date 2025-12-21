require('dotenv').config({ path: '.env.local' });
const payload = require('payload');

async function checkCategories() {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      mongoURL: process.env.MONGODB_URI,
      local: true,
    });

    const categories = await payload.find({
      collection: 'service-categories',
      sort: 'order',
    });

    console.log('Current Service Categories:');
    categories.docs.forEach(cat => {
      console.log(`- ${cat.name} (slug: ${cat.slug}, order: ${cat.order})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCategories();
