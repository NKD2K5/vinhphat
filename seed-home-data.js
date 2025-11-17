// Seed data for Home Page - VinhPhat Printing
// Run: node seed-home-data.js

const homePageData = {
  title: 'Trang Chủ - VinhPhat Printing',
  
  // SEO Fields
  seo: {
    metaTitle: 'VinhPhat Printing - Giải Pháp In Ấn Chuyên Nghiệp Hàng Đầu Việt Nam',
    metaDescription: 'VinhPhat Printing - Hơn 15 năm kinh nghiệm cung cấp dịch vụ in ấn chất lượng cao: In Offset, In Kỹ Thuật Số, In Bao Bì, Catalogue, Brochure. Cam kết chất lượng, giá cạnh tranh, giao hàng nhanh.',
    metaKeywords: 'in ấn, in offset, in kỹ thuật số, in bao bì, in catalogue, in brochure, in tờ rơi, in card visit, VinhPhat Printing, in ấn chuyên nghiệp',
  },
  ogImage: '', // Để trống, sẽ upload sau qua admin
  
  // Layout Blocks
  layout: [
    // 1. Hero Block - Banner chính
    {
      blockType: 'hero',
      slides: [
        {
          headline: '<h1>Giải Pháp In Ấn <strong>Chuyên Nghiệp</strong></h1>',
          subheadline: 'Chất lượng cao - Giá cạnh tranh - Giao hàng nhanh chóng',
          description: 'VinhPhat Printing với hơn 15 năm kinh nghiệm trong ngành in ấn, chúng tôi cam kết mang đến sản phẩm chất lượng tốt nhất cho khách hàng.',
          primaryButton: {
            text: 'Xem Sản Phẩm',
            link: '/san-pham'
          },
          secondaryButton: {
            text: 'Liên Hệ Ngay',
            link: '/lien-he'
          },
          backgroundImage: '' // Upload qua admin
        },
        {
          headline: '<h1>In Offset <strong>Chất Lượng Cao</strong></h1>',
          subheadline: 'Công nghệ hiện đại - Màu sắc sống động - Độ bền vượt trội',
          description: 'Hệ thống máy in offset Heidelberg hiện đại, đảm bảo chất lượng in ấn sắc nét, màu sắc chuẩn xác.',
          primaryButton: {
            text: 'Tìm Hiểu Thêm',
            link: '/dich-vu/in-offset'
          },
          secondaryButton: {
            text: 'Báo Giá',
            link: '/bao-gia'
          },
          backgroundImage: ''
        },
        {
          headline: '<h1>In Bao Bì <strong>Cao Cấp</strong></h1>',
          subheadline: 'Thiết kế độc đáo - In ấn tinh tế - Nâng tầm thương hiệu',
          description: 'Chuyên in bao bì các loại: hộp giấy, túi giấy, nhãn mác, tem decal với nhiều kỹ thuật gia công đặc biệt.',
          primaryButton: {
            text: 'Xem Mẫu',
            link: '/san-pham?category=bao-bi'
          },
          secondaryButton: {
            text: 'Tư Vấn Miễn Phí',
            link: '/lien-he'
          },
          backgroundImage: ''
        }
      ]
    },
    
    // 2. About Block - Giới thiệu ngắn
    {
      blockType: 'aboutBlock',
      title: 'VinhPhat Printing - Đối Tác In Ấn Đáng Tin Cậy',
      subtitle: 'Hơn 15 năm kinh nghiệm',
      description: '<p>VinhPhat Printing tự hào là một trong những đơn vị hàng đầu trong lĩnh vực in ấn tại Việt Nam. Với đội ngũ nhân viên chuyên nghiệp, trang thiết bị hiện đại và quy trình sản xuất khép kín, chúng tôi cam kết mang đến cho khách hàng những sản phẩm in ấn chất lượng cao nhất.</p><p>Chúng tôi chuyên cung cấp các dịch vụ: In Offset, In kỹ thuật số, In bao bì, In catalogue, In brochure, In tờ rơi, In card visit, In tem nhãn và nhiều sản phẩm in ấn khác.</p>',
      features: [
        {
          title: 'Chất Lượng Đảm Bảo',
          description: 'Sản phẩm được kiểm tra kỹ lưỡng trước khi giao hàng'
        },
        {
          title: 'Giá Cạnh Tranh',
          description: 'Báo giá minh bạch, không phát sinh chi phí'
        },
        {
          title: 'Giao Hàng Nhanh',
          description: 'Cam kết đúng tiến độ, giao hàng toàn quốc'
        },
        {
          title: 'Hỗ Trợ 24/7',
          description: 'Đội ngũ tư vấn nhiệt tình, chuyên nghiệp'
        }
      ],
      image: '' // Upload qua admin
    },
    
    // 3. Services Block - Dịch vụ
    {
      blockType: 'services',
      title: 'Dịch Vụ In Ấn',
      subtitle: 'Giải pháp toàn diện cho mọi nhu cầu',
      services: [
        {
          icon: 'printer',
          title: 'In Offset',
          description: 'In offset chất lượng cao cho số lượng lớn: catalogue, brochure, tờ rơi, bao bì...'
        },
        {
          icon: 'monitor',
          title: 'In Kỹ Thuật Số',
          description: 'In nhanh, in số lượng ít, in theo yêu cầu với công nghệ kỹ thuật số hiện đại'
        },
        {
          icon: 'package',
          title: 'In Bao Bì',
          description: 'Thiết kế và in bao bì: hộp giấy, túi giấy, nhãn mác, tem decal cao cấp'
        },
        {
          icon: 'book',
          title: 'In Catalogue',
          description: 'In catalogue, brochure, tạp chí với chất lượng in sắc nét, màu sắc chuẩn'
        },
        {
          icon: 'file-text',
          title: 'In Tờ Rơi',
          description: 'In tờ rơi, flyer quảng cáo với giá tốt, giao hàng nhanh chóng'
        },
        {
          icon: 'credit-card',
          title: 'In Card Visit',
          description: 'In card visit, name card cao cấp với nhiều chất liệu và kỹ thuật gia công'
        }
      ]
    },
    
    // 4. Featured Products Block - Sản phẩm nổi bật
    {
      blockType: 'featuredProducts',
      sectionId: 'san-pham-noi-bat',
      title: 'Sản Phẩm Nổi Bật',
      subtitle: 'Những sản phẩm được khách hàng tin dùng',
      limit: 8
    },
    
    // 5. Workflow Block - Quy trình làm việc
    {
      blockType: 'workflow',
      title: 'Quy Trình Làm Việc',
      subtitle: 'Đơn giản - Nhanh chóng - Hiệu quả',
      steps: [
        {
          stepNumber: 1,
          title: 'Tiếp Nhận Yêu Cầu',
          description: 'Khách hàng liên hệ và cung cấp thông tin về sản phẩm cần in'
        },
        {
          stepNumber: 2,
          title: 'Tư Vấn & Báo Giá',
          description: 'Đội ngũ tư vấn sẽ hỗ trợ và gửi báo giá chi tiết cho khách hàng'
        },
        {
          stepNumber: 3,
          title: 'Thiết Kế Mẫu',
          description: 'Thiết kế file in theo yêu cầu hoặc nhận file từ khách hàng'
        },
        {
          stepNumber: 4,
          title: 'Xác Nhận & Sản Xuất',
          description: 'Khách hàng xác nhận mẫu, chúng tôi tiến hành sản xuất'
        },
        {
          stepNumber: 5,
          title: 'Kiểm Tra Chất Lượng',
          description: 'Kiểm tra kỹ lưỡng chất lượng sản phẩm trước khi giao hàng'
        },
        {
          stepNumber: 6,
          title: 'Giao Hàng & Hỗ Trợ',
          description: 'Giao hàng đúng hẹn và hỗ trợ sau bán hàng'
        }
      ]
    },
    
    // 6. Testimonials Block - Đánh giá khách hàng
    {
      blockType: 'testimonials',
      title: 'Khách Hàng Nói Gì Về Chúng Tôi',
      subtitle: 'Hơn 5000+ khách hàng tin tưởng',
      limit: 6
    },
    
    // 7. Latest News Block - Tin tức mới nhất
    {
      blockType: 'latestNews',
      sectionId: 'tin-tuc-moi-nhat',
      title: 'Tin Tức & Khuyến Mãi',
      subtitle: 'Cập nhật thông tin mới nhất từ VinhPhat',
      limit: 3
    },
    
    // 8. Why Choose Us Block - Tại sao chọn chúng tôi
    {
      blockType: 'whyChooseUs',
      title: 'Tại Sao Chọn VinhPhat Printing?',
      subtitle: 'Những lý do khách hàng tin tưởng chọn chúng tôi',
      reasons: [
        {
          icon: 'award',
          title: '15+ Năm Kinh Nghiệm',
          description: 'Đội ngũ chuyên gia giàu kinh nghiệm trong ngành in ấn'
        },
        {
          icon: 'settings',
          title: 'Công Nghệ Hiện Đại',
          description: 'Trang thiết bị máy móc nhập khẩu từ Đức, Nhật Bản'
        },
        {
          icon: 'shield',
          title: 'Cam Kết Chất Lượng',
          description: 'Đổi trả miễn phí nếu sản phẩm không đạt yêu cầu'
        },
        {
          icon: 'dollar-sign',
          title: 'Giá Tốt Nhất',
          description: 'Báo giá cạnh tranh nhất thị trường, không phát sinh'
        },
        {
          icon: 'truck',
          title: 'Giao Hàng Toàn Quốc',
          description: 'Vận chuyển nhanh chóng, an toàn đến tay khách hàng'
        },
        {
          icon: 'headphones',
          title: 'Hỗ Trợ Tận Tâm',
          description: 'Tư vấn 24/7, giải đáp mọi thắc mắc của khách hàng'
        }
      ]
    },
    
    // 9. CTA Block - Call to Action
    {
      blockType: 'cta',
      text: '<h2>Bạn Cần Tư Vấn In Ấn?</h2><p>Liên hệ ngay với chúng tôi để nhận báo giá tốt nhất và tư vấn miễn phí!</p>',
      primaryButton: {
        text: 'Nhận Báo Giá',
        link: '/bao-gia'
      },
      secondaryButton: {
        text: 'Gọi Ngay: 0123 456 789',
        link: 'tel:0123456789'
      },
      backgroundImage: ''
    }
  ]
};

// Export để có thể import vào script khác
if (typeof module !== 'undefined' && module.exports) {
  module.exports = homePageData;
}

// Script để seed data vào Payload CMS
async function seedHomeData() {
  console.log('🌱 Starting to seed Home page data...');
  console.log('📄 Data structure:', JSON.stringify(homePageData, null, 2));
  console.log('\n✅ Home page data is ready!');
  console.log('\n📝 Next steps:');
  console.log('1. Copy data này vào Payload CMS admin');
  console.log('2. Vào http://localhost:3001/admin/collections/home-page');
  console.log('3. Tạo document mới và paste data');
  console.log('4. Upload các ảnh cần thiết qua CustomImageField');
  console.log('5. Save và publish!');
}

// Run nếu file được execute trực tiếp
if (require.main === module) {
  seedHomeData();
}
