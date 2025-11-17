const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority';
const dbName = 'VinhPhat';

async function checkDuplicateSlugs() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Đã kết nối MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection('products');

    // Kiểm tra các slug cụ thể
    const slugsToCheck = [
      'in-to-roi-nhanh',
      'in-to-roi-so-luong-lon',
      'in-catalogue-premium',
      'in-catalogue-nhanh',
      'in-poster-premium',
    ];

    console.log('🔍 Kiểm tra slug trong database:\n');
    console.log('='.repeat(80));

    for (const slug of slugsToCheck) {
      const products = await collection.find({ slug: slug }).toArray();
      
      console.log(`\nSlug: ${slug}`);
      console.log(`Số sản phẩm tìm thấy: ${products.length}`);
      
      products.forEach((p, i) => {
        console.log(`  ${i + 1}. Name: ${p.name}`);
        console.log(`     ID: ${p.id || p._id}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n🔍 Tìm tất cả sản phẩm có tên "In Tờ Rơi Số Lượng Lớn":\n');

    const problematicProducts = await collection.find({ 
      name: { $regex: 'In Tờ Rơi Số Lượng Lớn', $options: 'i' } 
    }).toArray();

    console.log(`Tìm thấy: ${problematicProducts.length} sản phẩm\n`);
    
    problematicProducts.forEach((p, i) => {
      console.log(`${i + 1}. Name: ${p.name}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   ID: ${p.id || p._id}\n`);
    });

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await client.close();
    console.log('✅ Đã đóng kết nối MongoDB');
  }
}

checkDuplicateSlugs();
