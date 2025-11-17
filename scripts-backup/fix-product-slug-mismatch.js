const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority';
const dbName = 'VinhPhat';

// Sửa slug cho các sản phẩm bị sai
const fixes = [
  {
    currentSlug: 'in-to-roi-nhanh',
    correctName: 'In Tờ Rơi Nhanh',
    correctSlug: 'in-to-roi-nhanh',
  },
  {
    currentName: 'In Tờ Rơi Số Lượng Lớn',
    correctSlug: 'in-to-roi-so-luong-lon',
  },
];

async function fixSlugMismatch() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Đã kết nối MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection('products');

    // Tìm sản phẩm có slug in-to-roi-nhanh
    const product = await collection.findOne({ slug: 'in-to-roi-nhanh' });
    
    if (product) {
      console.log('🔍 Tìm thấy sản phẩm:');
      console.log(`   Tên hiện tại: ${product.name}`);
      console.log(`   Slug hiện tại: ${product.slug}\n`);

      if (product.name === 'In Tờ Rơi Số Lượng Lớn') {
        console.log('⚠️  PHÁT HIỆN LỖI: Tên và slug không khớp!\n');
        
        // Sửa slug thành in-to-roi-so-luong-lon
        await collection.updateOne(
          { _id: product._id },
          { $set: { slug: 'in-to-roi-so-luong-lon' } }
        );
        
        console.log('✅ Đã sửa slug thành: in-to-roi-so-luong-lon\n');
      }
    }

    // Kiểm tra xem có sản phẩm nào tên là "In Tờ Rơi Nhanh" không
    const correctProduct = await collection.findOne({ name: 'In Tờ Rơi Nhanh' });
    
    if (correctProduct) {
      console.log('✅ Đã có sản phẩm "In Tờ Rơi Nhanh"');
      console.log(`   Slug: ${correctProduct.slug}\n`);
    } else {
      console.log('⚠️  Chưa có sản phẩm "In Tờ Rơi Nhanh"');
      console.log('   → Cần tạo sản phẩm mới hoặc đổi tên sản phẩm khác\n');
    }

    // Liệt kê tất cả sản phẩm tờ rơi
    console.log('📋 Danh sách sản phẩm Tờ Rơi:');
    console.log('='.repeat(80));
    
    const flyerProducts = await collection.find({ 
      name: { $regex: 'Tờ Rơi', $options: 'i' } 
    }).toArray();
    
    flyerProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   → Slug: ${p.slug}`);
      console.log(`   → ID: ${p.id || p._id}\n`);
    });

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await client.close();
    console.log('✅ Đã đóng kết nối MongoDB');
  }
}

fixSlugMismatch();
