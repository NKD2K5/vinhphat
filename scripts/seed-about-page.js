require('dotenv').config({ path: '.env.local' });
const payload = require('payload');

// Dữ liệu demo cho collection Trang Giới Thiệu (slug: 'about-page')
const aboutPageData = {
  title: 'Về VinhPhat Printing',
  slug: 've-chung-toi',

  hero: {
    heading: 'Về VinhPhat Printing',
    subheading: 'Đối tác in ấn đáng tin cậy với hơn 15 năm kinh nghiệm',
  },

  layout: [
    // 1. CompanyStoryBlock
    {
      blockType: 'companyStory',
      heading: 'Câu Chuyện Hình Thành & Phát Triển',
      image: '', // upload sau trong admin nếu cần
      content:
        '<p>VinhPhat Printing được thành lập với sứ mệnh mang đến các giải pháp in ấn chất lượng cao cho doanh nghiệp vừa và nhỏ tại Việt Nam.</p>' +
        '<p>Trải qua nhiều năm phát triển, chúng tôi đã đầu tư mạnh mẽ vào hệ thống máy móc hiện đại, quy trình sản xuất chuẩn hóa và đội ngũ nhân sự chuyên nghiệp.</p>',
    },

    // 2. MissionVisionBlock
    {
      blockType: 'missionVision',
      mission: {
        title: 'Sứ Mệnh',
        content:
          'Mang đến giải pháp in ấn trọn gói, tối ưu chi phí, đảm bảo chất lượng cho mọi khách hàng ở mọi quy mô.',
        image: '',
      },
      vision: {
        title: 'Tầm Nhìn',
        content:
          'Trở thành một trong những đơn vị in ấn uy tín hàng đầu tại Việt Nam, đồng hành cùng sự phát triển của thương hiệu Việt.',
        image: '',
      },
    },

    // 3. CoreValuesBlock
    {
      blockType: 'coreValues',
      title: 'Giá Trị Cốt Lõi',
      values: [
        {
          title: 'Chất Lượng',
          description: 'Luôn đặt chất lượng sản phẩm lên hàng đầu trong mọi dự án.',
          icon: 'check',
        },
        {
          title: 'Tốc Độ',
          description: 'Tối ưu quy trình để rút ngắn thời gian sản xuất và giao hàng.',
          icon: 'lightning',
        },
        {
          title: 'Tận Tâm',
          description: 'Hỗ trợ khách hàng từ khâu tư vấn, thiết kế đến hoàn thiện.',
          icon: 'users',
        },
      ],
    },

    // 4. AchievementsBlock
    {
      blockType: 'achievements',
      title: 'Thành Tựu Nổi Bật',
      stats: [
        {
          number: '15+',
          label: 'Năm Kinh Nghiệm',
        },
        {
          number: '5000+',
          label: 'Khách Hàng Đã Phục Vụ',
        },
        {
          number: '1M+',
          label: 'Ấn Phẩm Đã Sản Xuất',
        },
      ],
    },
  ],

  seo: {
    metaTitle: 'Về VinhPhat Printing - Giới Thiệu Công Ty In Ấn',
    metaDescription:
      'Tìm hiểu về VinhPhat Printing - đơn vị in ấn chuyên nghiệp với hơn 15 năm kinh nghiệm, trang thiết bị hiện đại và đội ngũ tận tâm.',
  },
};

async function seedAboutPage() {
  try {
    console.log('🌱 Khởi động seed Trang Giới Thiệu (about-page)...');

    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      mongoURL: process.env.MONGODB_URI,
      local: true,
    });

    console.log('✅ Payload đã khởi tạo, tìm document about-page với slug = "gioi-thieu"...');

    const existing = await payload.find({
      collection: 'about-page',
      where: {
        slug: {
          equals: 'gioi-thieu',
        },
      },
      limit: 1,
    });

    let result;
    if (existing.docs && existing.docs.length > 0) {
      console.log('🔁 Đã tồn tại trang giới thiệu, tiến hành update...');
      result = await payload.update({
        collection: 'about-page',
        id: existing.docs[0].id,
        data: aboutPageData,
      });
    } else {
      console.log('➕ Chưa có trang giới thiệu, tiến hành create mới...');
      result = await payload.create({
        collection: 'about-page',
        data: aboutPageData,
      });
    }

    console.log('✅ Seed Trang Giới Thiệu thành công!');
    console.log('Kết quả:', {
      id: result.id,
      title: result.title,
      slug: result.slug,
    });

    console.log('\n👉 Bây giờ bạn có thể vào: http://localhost:3001/admin/collections/about-page để xem và chỉnh sửa.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi seed Trang Giới Thiệu:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedAboutPage();
}
