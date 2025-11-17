const payload = require('payload');
require('dotenv').config();

const additionalCategories = [
  {
    name: 'Kiến Thức In Ấn',
    slug: 'kien-thuc-in-an',
    description: 'Kiến thức cơ bản và nâng cao về in ấn',
    order: 2,
  },
  {
    name: 'Xu Hướng & Công Nghệ',
    slug: 'xu-huong-cong-nghe',
    description: 'Xu hướng mới và công nghệ tiên tiến trong ngành in ấn',
    order: 3,
  },
  {
    name: 'Mẹo Thiết Kế',
    slug: 'meo-thiet-ke',
    description: 'Mẹo và hướng dẫn thiết kế cho sản phẩm in ấn',
    order: 4,
  },
];

async function createCategories() {
  try {
    console.log('🚀 Đang khởi động Payload...');
    
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
      mongoURL: process.env.MONGODB_URI || 'mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority',
      local: true,
    });

    console.log('✅ Payload đã khởi động thành công\n');
    console.log('📁 Bắt đầu tạo danh mục...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const categoryData of additionalCategories) {
      try {
        // Kiểm tra xem danh mục đã tồn tại chưa
        const existing = await payload.find({
          collection: 'news-categories',
          where: {
            slug: {
              equals: categoryData.slug,
            },
          },
          limit: 1,
        });

        if (existing.docs.length > 0) {
          console.log(`⚠️  Bỏ qua: "${categoryData.name}" (đã tồn tại)`);
          continue;
        }

        // Tạo danh mục mới
        const category = await payload.create({
          collection: 'news-categories',
          data: categoryData,
        });

        successCount++;
        console.log(`✅ Đã tạo: "${category.name}"`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Lỗi khi tạo "${categoryData.name}":`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 KẾT QUẢ:');
    console.log(`   ✅ Thành công: ${successCount} danh mục`);
    console.log(`   ❌ Lỗi: ${errorCount} danh mục`);
    console.log(`   📝 Tổng cộng: ${additionalCategories.length} danh mục`);
    console.log('='.repeat(60));

    console.log('\n🎉 Hoàn thành! Bạn có thể xem danh mục tại:');
    console.log('   - Admin: http://localhost:3001/admin/collections/news-categories');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ LỖI:', error);
    process.exit(1);
  }
}

createCategories();
