const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority';
const dbName = 'VinhPhat';

// Hàm chuyển tiếng Việt có dấu thành không dấu
function removeVietnameseTones(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/[^a-z0-9\s-]/g, '');
  str = str.replace(/\s+/g, '-');
  str = str.replace(/-+/g, '-');
  str = str.trim();
  return str;
}

async function fixVietnameseSlugs() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Đã kết nối MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection('products');

    // Lấy tất cả sản phẩm có slug chứa dấu
    const products = await collection.find({}).toArray();
    
    let fixed = 0;
    let skipped = 0;

    console.log('🔄 Đang sửa slug có dấu tiếng Việt...\n');
    console.log('='.repeat(80));

    for (const product of products) {
      const currentSlug = product.slug;
      const correctSlug = removeVietnameseTones(currentSlug);

      if (currentSlug !== correctSlug) {
        // Kiểm tra xem slug mới đã tồn tại chưa
        const existing = await collection.findOne({ 
          slug: correctSlug,
          _id: { $ne: product._id }
        });

        if (existing) {
          console.log(`⚠️  ${product.name}`);
          console.log(`   Slug cũ: ${currentSlug}`);
          console.log(`   Slug mới: ${correctSlug} (ĐÃ TỒN TẠI - BỎ QUA)\n`);
          skipped++;
        } else {
          await collection.updateOne(
            { _id: product._id },
            { $set: { slug: correctSlug } }
          );

          console.log(`✅ ${product.name}`);
          console.log(`   Slug cũ: ${currentSlug}`);
          console.log(`   Slug mới: ${correctSlug}\n`);
          fixed++;
        }
      }
    }

    console.log('='.repeat(80));
    console.log(`✅ Đã sửa: ${fixed} slug`);
    console.log(`⚠️  Bỏ qua: ${skipped} slug (đã tồn tại)`);
    console.log(`📊 Tổng số sản phẩm: ${products.length}`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await client.close();
    console.log('\n✅ Đã đóng kết nối MongoDB');
  }
}

fixVietnameseSlugs();
