const payload = require('payload');
require('dotenv').config();

// Mapping slug bài viết -> slug danh mục
const categoryMapping = {
  'xu-huong-in-an-2025': 'xu-huong-cong-nghe',
  'so-sanh-in-offset-va-in-ky-thuat-so': 'kien-thuc-in-an',
  '10-meo-thiet-ke-catalogue-chuyen-nghiep': 'meo-thiet-ke',
  'huong-dan-chon-giay-in-phu-hop': 'kien-thuc-in-an',
  'bi-quyet-thiet-ke-name-card-an-tuong': 'meo-thiet-ke',
  'quy-trinh-in-an-chuyen-nghiep': 'kien-thuc-in-an',
  'cach-chon-mau-sac-phu-hop-cho-san-pham-in-an': 'meo-thiet-ke',
  'in-an-brochure-nhung-dieu-can-biet': 'kien-thuc-in-an',
  'su-khac-biet-giua-in-uv-va-in-thuong': 'xu-huong-cong-nghe',
  'checklist-chuan-bi-file-in': 'kien-thuc-in-an',
  'in-an-bao-bi-xu-huong-va-giai-phap': 'xu-huong-cong-nghe',
  'bi-mat-tao-flyer-quang-cao-hieu-qua': 'meo-thiet-ke',
};

async function updateNewsCategories() {
  try {
    console.log('🚀 Đang khởi động Payload...');
    
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
      mongoURL: process.env.MONGODB_URI || 'mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority',
      local: true,
    });

    console.log('✅ Payload đã khởi động thành công\n');

    // Lấy tất cả danh mục
    const categoriesResponse = await payload.find({
      collection: 'news-categories',
      limit: 100,
    });
    const categories = categoriesResponse.docs;
    
    console.log(`📁 Tìm thấy ${categories.length} danh mục\n`);
    console.log('🔄 Bắt đầu cập nhật danh mục cho tin tức...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const [newsSlug, categorySlug] of Object.entries(categoryMapping)) {
      try {
        // Tìm bài viết
        const newsResponse = await payload.find({
          collection: 'news',
          where: {
            slug: {
              equals: newsSlug,
            },
          },
          limit: 1,
        });

        if (newsResponse.docs.length === 0) {
          console.log(`⚠️  Không tìm thấy bài viết: "${newsSlug}"`);
          continue;
        }

        const news = newsResponse.docs[0];

        // Tìm danh mục
        const category = categories.find(cat => cat.slug === categorySlug);
        if (!category) {
          console.log(`⚠️  Không tìm thấy danh mục: "${categorySlug}"`);
          continue;
        }

        // Cập nhật bài viết
        await payload.update({
          collection: 'news',
          id: news.id,
          data: {
            category: category.id,
          },
        });

        successCount++;
        console.log(`✅ Đã cập nhật: "${news.title}" → "${category.name}"`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Lỗi khi cập nhật "${newsSlug}":`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 KẾT QUẢ:');
    console.log(`   ✅ Thành công: ${successCount} bài`);
    console.log(`   ❌ Lỗi: ${errorCount} bài`);
    console.log(`   📝 Tổng cộng: ${Object.keys(categoryMapping).length} bài`);
    console.log('='.repeat(60));

    console.log('\n🎉 Hoàn thành! Bạn có thể xem tin tức tại:');
    console.log('   - Admin: http://localhost:3001/admin/collections/news');
    console.log('   - Website: http://localhost:3000/tin-tuc');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ LỖI:', error);
    process.exit(1);
  }
}

updateNewsCategories();
