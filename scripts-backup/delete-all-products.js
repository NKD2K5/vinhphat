require('dotenv').config();
const axios = require('axios');

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

async function deleteAllProducts() {
  try {
    console.log('🗑️  Starting product deletion...\n');

    // Fetch all products
    console.log('📦 Fetching all products...');
    const response = await axios.get(`${PAYLOAD_URL}/api/products?limit=1000`);
    const products = response.data.docs;
    
    console.log(`✅ Found ${products.length} products\n`);

    if (products.length === 0) {
      console.log('✅ No products to delete.');
      return;
    }

    // Delete each product
    let deleted = 0;
    for (const product of products) {
      try {
        await axios.delete(`${PAYLOAD_URL}/api/products/${product.id}`);
        console.log(`  ✅ Deleted: ${product.name}`);
        deleted++;
      } catch (error) {
        console.error(`  ❌ Error deleting ${product.name}:`, error.message);
      }
    }

    console.log(`\n✅ Deletion completed!`);
    console.log(`📊 Total products deleted: ${deleted}/${products.length}`);
  } catch (error) {
    console.error('❌ Error deleting products:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the deletion
deleteAllProducts();
