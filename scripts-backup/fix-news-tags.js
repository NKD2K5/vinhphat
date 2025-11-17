const payload = require('payload');
require('dotenv').config();

async function fixNewsTags() {
  try {
    console.log('🚀 Đang khởi động Payload...');
    
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
      mongoURL: process.env.MONGODB_URI || 'mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority',
      local: true,
    });

    console.log('✅ Payload đã khởi động thành công\n');
    console.log('🔄 Bắt đầu sửa tags cho tin tức...\n');

    // Lấy tất cả tin tức
    const newsResponse = await payload.find({
      collection: 'news',
      limit: 1000,
    });

    const allNews = newsResponse.docs;
    console.log(`📰 Tìm thấy ${allNews.length} bài tin tức\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const news of allNews) {
      try {
        if (news.tags && Array.isArray(news.tags)) {
          // Chuyển đổi tags về format đúng: chỉ giữ field 'tag'
          const cleanedTags = news.tags.map(tagObj => {
            if (typeof tagObj === 'object' && tagObj.tag) {
              return { tag: tagObj.tag };
            }
            return tagObj;
          });

          // Cập nhật bài viết
          await payload.update({
            collection: 'news',
            id: news.id,
            data: {
              tags: cleanedTags,
            },
          });

          successCount++;
          console.log(`✅ Đã sửa: "${news.title}" (${cleanedTags.length} tags)`);
        } else {
          console.log(`⚠️  Bỏ qua: "${news.title}" (không có tags)`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Lỗi khi sửa "${news.title}":`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 KẾT QUẢ:');
    console.log(`   ✅ Thành công: ${successCount} bài`);
    console.log(`   ❌ Lỗi: ${errorCount} bài`);
    console.log(`   📝 Tổng cộng: ${allNews.length} bài`);
    console.log('='.repeat(60));

    console.log('\n🎉 Hoàn thành! Bạn có thể xem tin tức tại:');
    console.log('   - Website: http://localhost:3000/tin-tuc');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ LỖI:', error);
    process.exit(1);
  }
}

fixNewsTags();
