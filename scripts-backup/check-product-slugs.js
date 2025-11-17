const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'vinhphat';

async function checkSlugs() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Đã kết nối MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection('products');

    // Lấy tất cả sản phẩm
    const products = await collection.find({}).toArray();

    console.log(`📦 Tổng số sản phẩm: ${products.length}\n`);
    console.log('=' .repeat(80));
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Slug: ${product.slug || '❌ KHÔNG CÓ SLUG'}`);
      console.log(`   ID: ${product.id}`);
      console.log('-'.repeat(80));
    });

    // Tìm slug trùng
    const slugs = products.map(p => p.slug).filter(Boolean);
    const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
    
    if (duplicates.length > 0) {
      console.log('\n⚠️  CẢNH BÁO: Có slug bị trùng!');
      duplicates.forEach(slug => {
        console.log(`   - ${slug}`);
      });
    } else {
      console.log('\n✅ Không có slug trùng');
    }

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await client.close();
  }
}

checkSlugs();
