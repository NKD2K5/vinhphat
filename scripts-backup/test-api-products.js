// Test API để xem data trả về
const slugsToTest = [
  'in-to-roi-nhanh',
  'in-to-roi-so-luong-lon',
  'in-catalogue-premium',
  'in-catalogue-nhanh',
  'in-poster-premium',
];

async function testAPI() {
  console.log('🔍 Testing Product API...\n');
  console.log('='.repeat(80));

  for (const slug of slugsToTest) {
    try {
      const response = await fetch(`http://localhost:3000/api/products?depth=2&where[slug][equals]=${slug}`);
      const data = await response.json();
      
      if (data.docs && data.docs.length > 0) {
        const product = data.docs[0];
        console.log(`\n✅ Slug: ${slug}`);
        console.log(`   Name: ${product.name}`);
        console.log(`   Has specifications: ${!!product.specifications}`);
        console.log(`   Has gallery: ${product.gallery?.length || 0} images`);
        console.log(`   Has features: ${product.features?.length || 0} items`);
        console.log(`   Has detailedInfo: ${product.detailedInfo?.length || 0} paragraphs`);
      } else {
        console.log(`\n❌ Slug: ${slug} - NOT FOUND`);
      }
    } catch (error) {
      console.error(`\n❌ Error testing ${slug}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(80));
}

testAPI();
