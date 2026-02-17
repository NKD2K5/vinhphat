require('dotenv').config({ path: '.env.local' });

async function testServicesAPI() {
  try {
    console.log('=== Testing Services API ===');
    
    // Test categories
    const categoriesRes = await fetch('http://localhost:3001/api/service-categories?sort=order&limit=100');
    console.log('Categories status:', categoriesRes.status);
    
    if (categoriesRes.ok) {
      const categoriesData = await categoriesRes.json();
      console.log(`Found ${categoriesData.docs.length} categories:`);
      categoriesData.docs.forEach((cat, idx) => {
        console.log(`  ${idx + 1}. ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`);
      });
    }
    
    // Test services
    const servicesRes = await fetch('http://localhost:3001/api/service-items?sort=order&limit=100&where[isActive][equals]=true');
    console.log('\nServices status:', servicesRes.status);
    
    if (servicesRes.ok) {
      const servicesData = await servicesRes.json();
      console.log(`Found ${servicesData.docs.length} services:`);
      servicesData.docs.forEach((service, idx) => {
        console.log(`  ${idx + 1}. ${service.name} (Category: ${service.category})`);
      });
    }
    
    // Test Next.js API
    console.log('\n=== Testing Next.js API ===');
    const nextApiRes = await fetch('http://localhost:3000/api/services');
    console.log('Next.js API status:', nextApiRes.status);
    
    if (nextApiRes.ok) {
      const nextApiData = await nextApiRes.json();
      console.log('Next.js API response:', JSON.stringify(nextApiData, null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testServicesAPI();
