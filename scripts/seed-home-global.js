require('dotenv').config({ path: '.env.local' });
const payload = require('payload');

// Dữ liệu demo cho Global Home (slug: 'home-page')
const homeGlobalData = {
  title: 'Trang Chủ - VinhPhat Printing',

  seo: {
    metaTitle: 'VinhPhat Printing - Giải Pháp In Ấn Chuyên Nghiệp',
    metaDescription:
      'VinhPhat Printing cung cấp giải pháp in ấn offset, kỹ thuật số, bao bì, catalogue, brochure với chất lượng cao và giá cạnh tranh.',
    metaKeywords:
      'in ấn, in offset, in kỹ thuật số, in bao bì, in catalogue, in brochure, in tờ rơi, in card visit, VinhPhat Printing',
    ogImage: '', // có thể upload sau trong admin
  },

  heroSection: {
    slides: [
      {
        headline: 'Giải Pháp In Ấn Chuyên Nghiệp',
        subheadline: 'Chất lượng cao - Giá cạnh tranh - Giao hàng nhanh chóng',
        backgroundImage: '', // upload sau qua admin
        backgroundColor: '#1e40af',
        primaryButton: {
          text: 'Nhận Báo Giá Ngay',
          link: '/bao-gia',
        },
        secondaryButton: {
          text: 'Xem Sản Phẩm',
          link: '/san-pham',
        },
      },
    ],
    stats: [
      { value: '15+', label: 'Năm Kinh Nghiệm', icon: '📊' },
      { value: '5000+', label: 'Khách Hàng', icon: '👥' },
      { value: '1M+', label: 'Sản Phẩm Đã In', icon: '📦' },
    ],
  },

  aboutSection: {
    title: 'VinhPhat - Đối Tác In Ấn Đáng Tin Cậy',
    description:
      '<p>VinhPhat Printing là đơn vị chuyên cung cấp giải pháp in ấn toàn diện cho doanh nghiệp: từ tờ rơi, catalogue, bao bì cho đến ấn phẩm nhận diện thương hiệu.</p><p>Chúng tôi sở hữu hệ thống máy in hiện đại, đội ngũ kỹ thuật giàu kinh nghiệm và quy trình kiểm soát chất lượng chặt chẽ.</p>',
    image: '', // upload sau
    primaryButton: {
      text: 'Xem Thêm Về Chúng Tôi',
      link: '/ve-chung-toi',
    },
    secondaryButton: {
      text: 'Liên Hệ Tư Vấn',
      link: '/lien-he',
    },
  },

  servicesSection: {
    title: 'Dịch Vụ In Ấn Của Chúng Tôi',
  },
};

async function seedHomeGlobal() {
  try {
    console.log('🌱 Khởi động seed Global Home (home-page)...');

    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      mongoURL: process.env.MONGODB_URI,
      local: true,
    });

    console.log('✅ Payload đã khởi tạo, bắt đầu updateGlobal("home-page")...');

    const result = await payload.updateGlobal({
      slug: 'home-page',
      data: homeGlobalData,
    });

    console.log('✅ Seed Home Global thành công!');
    console.log('Kết quả:', {
      id: result.id,
      title: result.title,
    });

    console.log('\n👉 Bây giờ bạn có thể vào: http://localhost:3001/admin/globals/home-page để xem và chỉnh sửa.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi seed Global Home:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedHomeGlobal();
}
