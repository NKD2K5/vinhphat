require('dotenv').config({ path: '.env.local' });
const payload = require('payload');

// 5 dịch vụ chính với các dịch vụ con
const serviceCategoriesData = [
  {
    name: 'In Thẻ Cào',
    slug: 'in-the-cao',
    description: 'Dịch vụ in thẻ cào chất lượng cao cho các chương trình khuyến mãi, vé số, thẻ quà tặng',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1000&q=80',
    icon: 'ticket',
    color: '#3B82F6',
    order: 1,
    isActive: true,
  },
  {
    name: 'In Bao Bì',
    slug: 'in-bao-bi',
    description: 'In ấn bao bì, hộp giấy, túi đựng sản phẩm chuyên nghiệp',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80',
    icon: 'package',
    color: '#10B981',
    order: 2,
    isActive: true,
  },
  {
    name: 'In Catalogue',
    slug: 'in-catalogue',
    description: 'Thiết kế và in ấn catalogue, brochure, tờ rơi quảng cáo',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1000&q=80',
    icon: 'book',
    color: '#F59E0B',
    order: 3,
    isActive: true,
  },
  {
    name: 'In Tem Nhãn',
    slug: 'in-tem-nhan',
    description: 'In tem nhãn sản phẩm, tem chống hàng giả, tem bảo hành',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1000&q=80',
    icon: 'tag',
    color: '#EF4444',
    order: 4,
    isActive: true,
  },
  {
    name: 'In Văn Phòng Phẩm',
    slug: 'in-van-phong-pham',
    description: 'In ấn văn phòng phẩm: name card, giấy tiêu đề, phong bì, thư mời',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1000&q=80',
    icon: 'briefcase',
    color: '#8B5CF6',
    order: 5,
    isActive: true,
  },
];

// Dịch vụ con cho từng danh mục
const servicesData = [
  // In Thẻ Cào
  {
    name: 'Thẻ Cào Vé Số',
    slug: 'the-cao-ve-so',
    category: 'in-the-cao',
    description: 'In thẻ cào vé số, xổ số tự chọn với chất lượng cao',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Chuyên in thẻ cào vé số với công nghệ hiện đại, đảm bảo chất lượng và bảo mật. Chất liệu cao cấp, lớp phủ chống ẩm, số in rõ nét.' }
        ]
      }
    ],
    features: [
      { feature: 'Chất liệu giấy cao cấp' },
      { feature: 'Công nghệ in chống làm giả' },
      { feature: 'Lớp phủ bảo vệ' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Tờ',
      minOrder: '1,000 tờ'
    },
    order: 1,
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Thẻ Cào Khuyến Mãi',
    slug: 'the-cao-khuyen-mai',
    category: 'in-the-cao',
    description: 'Thẻ cào khuyến mãi, quà tặng cho các chương trình marketing',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Thiết kế và in ấn thẻ cào khuyến mãi độc đáo, thu hút khách hàng. Nhiều kích thước và chất liệu lựa chọn.' }
        ]
      }
    ],
    features: [
      { feature: 'Thiết kế độc đáo' },
      { feature: 'Nhiều kích thước' },
      { feature: 'Giá cạnh tranh' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Tờ',
      minOrder: '500 tờ'
    },
    order: 2,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Thẻ Cào Sim Điện Thoại',
    slug: 'the-cao-sim-dien-thoai',
    category: 'in-the-cao',
    description: 'In thẻ cào sim điện thoại, thẻ nạp tiền',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Chuyên in thẻ cào sim điện thoại với tiêu chuẩn bảo mật cao. Số in rõ nét, lớp phủ chống làm giả.' }
        ]
      }
    ],
    features: [
      { feature: 'Bảo mật cao' },
      { feature: 'Số in rõ nét' },
      { feature: 'Đạt chuẩn' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Tờ',
      minOrder: '1,000 tờ'
    },
    order: 3,
    isActive: true,
    isFeatured: false,
  },

  // In Bao Bì
  {
    name: 'Hộp Giấy Cao Cấp',
    slug: 'hop-giay-cao-cap',
    category: 'in-bao-bi',
    description: 'In hộp giấy cao cấp cho sản phẩm cao cấp, quà tặng',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Thiết kế và in ấn hộp giấy cao cấp với nhiều chất liệu và công nghệ gia công hiện đại. Hoàn thiện tinh xảo.' }
        ]
      }
    ],
    features: [
      { feature: 'Chất liệu cao cấp' },
      { feature: 'Gia công chính xác' },
      { feature: 'Thiết kế sang trọng' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Cái',
      minOrder: '100 cái'
    },
    order: 1,
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Túi Giấy Thời Trang',
    slug: 'tui-giay-thoi-trang',
    category: 'in-bao-bi',
    description: 'Túi giấy thời trang, túi đựng quà tặng sang trọng',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Sản xuất túi giấy thời trang với thiết kế độc đáo, chất liệu bền đẹp. Phù hợp cho các thương hiệu cao cấp.' }
        ]
      }
    ],
    features: [
      { feature: 'Thiết kế thời trang' },
      { feature: 'Chất liệu bền đẹp' },
      { feature: 'Thương hiệu cao cấp' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Cái',
      minOrder: '200 cái'
    },
    order: 2,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Bao Bì Thực Phẩm',
    slug: 'bao-bi-thuc-pham',
    category: 'in-bao-bi',
    description: 'Bao bì thực phẩm an toàn, đạt chuẩn vệ sinh',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'In ấn bao bì thực phẩm an toàn, đạt chuẩn vệ sinh. Chất liệu an toàn cho thực phẩm, in ấn màu sắc đẹp.' }
        ]
      }
    ],
    features: [
      { feature: 'An toàn thực phẩm' },
      { feature: 'Đạt chuẩn vệ sinh' },
      { feature: 'Màu sắc đẹp' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Cái',
      minOrder: '500 cái'
    },
    order: 3,
    isActive: true,
    isFeatured: false,
  },

  // In Catalogue
  {
    name: 'Catalogue Sản Phẩm',
    slug: 'catalogue-san-pham',
    category: 'in-catalogue',
    description: 'In catalogue sản phẩm chất lượng cao',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Thiết kế và in ấn catalogue sản phẩm chuyên nghiệp. Giấy chất lượng cao, in sắc nét, đóng gói tinh xảo.' }
        ]
      }
    ],
    features: [
      { feature: 'Giấy chất lượng cao' },
      { feature: 'In sắc nét' },
      { feature: 'Thiết kế chuyên nghiệp' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Quyển',
      minOrder: '50 quyển'
    },
    order: 1,
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Brochure Quảng Cáo',
    slug: 'brochure-quang-cao',
    category: 'in-catalogue',
    description: 'Brochure quảng cáo, tờ rơi marketing',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'In brochure quảng cáo, tờ rơi marketing với thiết kế hấp dẫn. Giấy couche cao cấp, in 4 màu sắc nét.' }
        ]
      }
    ],
    features: [
      { feature: 'Thiết kế hấp dẫn' },
      { feature: 'Giấy couche cao cấp' },
      { feature: 'In 4 màu sắc nét' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Tờ',
      minOrder: '100 tờ'
    },
    order: 2,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Profile Công Ty',
    slug: 'profile-cong-ty',
    category: 'in-catalogue',
    description: 'Profile công ty, hồ sơ năng lực chuyên nghiệp',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Thiết kế và in ấn profile công ty chuyên nghiệp. Bìa cứng, giấy chất lượng, đóng gói sang trọng.' }
        ]
      }
    ],
    features: [
      { feature: 'Bìa cứng' },
      { feature: 'Giấy chất lượng' },
      { feature: 'Đóng gói sang trọng' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Quyển',
      minOrder: '20 quyển'
    },
    order: 3,
    isActive: true,
    isFeatured: false,
  },

  // In Tem Nhãn
  {
    name: 'Tem Nhãn Sản Phẩm',
    slug: 'tem-nhan-san-pham',
    category: 'in-tem-nhan',
    description: 'Tem nhãn sản phẩm, mác hàng hóa',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'In tem nhãn sản phẩm, mác hàng hóa chất lượng cao. Nhiều chất liệu, công nghệ in hiện đại, bền màu.' }
        ]
      }
    ],
    features: [
      { feature: 'Chất lượng cao' },
      { feature: 'Nhiều chất liệu' },
      { feature: 'Bền màu' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Cái',
      minOrder: '1,000 cái'
    },
    order: 1,
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Tem Chống Hàng Giả',
    slug: 'tem-chong-hang-gia',
    category: 'in-tem-nhan',
    description: 'Tem chống hàng giả, tem bảo hành',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'In tem chống hàng giả, tem bảo hành với công nghệ cao. Tem hologram, tem QR code, tem vỡ.' }
        ]
      }
    ],
    features: [
      { feature: 'Công nghệ cao' },
      { feature: 'Tem hologram' },
      { feature: 'Tem QR code' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Cái',
      minOrder: '5,000 cái'
    },
    order: 2,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Tem Decal',
    slug: 'tem-decal',
    category: 'in-tem-nhan',
    description: 'Tem decal, tem dán sản phẩm',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'In tem decal, tem dán sản phẩm với nhiều chất liệu. Decal giấy, decal nhựa, decal trong suốt.' }
        ]
      }
    ],
    features: [
      { feature: 'Nhiều chất liệu' },
      { feature: 'Decal giấy' },
      { feature: 'Decal nhựa' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Cái',
      minOrder: '500 cái'
    },
    order: 3,
    isActive: true,
    isFeatured: false,
  },

  // In Văn Phòng Phẩm
  {
    name: 'Name Card',
    slug: 'name-card',
    category: 'in-van-phong-pham',
    description: 'In name card, danh thiếp chuyên nghiệp',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Thiết kế và in name card chuyên nghiệp. Nhiều chất liệu giấy, công nghệ in hiện đại, bo góc tinh xảo.' }
        ]
      }
    ],
    features: [
      { feature: 'Nhiều chất liệu' },
      { feature: 'In hiện đại' },
      { feature: 'Bo góc tinh xảo' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Cái',
      minOrder: '100 cái'
    },
    order: 1,
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Giấy Tiêu Đề',
    slug: 'giay-tieu-de',
    category: 'in-van-phong-pham',
    description: 'In giấy tiêu đề, letterhead công ty',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'In giấy tiêu đề, letterhead công ty chất lượng cao. Giấy mỹ thuật, in offset, thiết kế chuyên nghiệp.' }
        ]
      }
    ],
    features: [
      { feature: 'Giấy mỹ thuật' },
      { feature: 'In offset' },
      { feature: 'Thiết kế chuyên nghiệp' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Tờ',
      minOrder: '200 tờ'
    },
    order: 2,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Phong Bì Công Ty',
    slug: 'phong-bi-cong-ty',
    category: 'in-van-phong-pham',
    description: 'In phong bì công ty, phong bì tiêu chuẩn',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'In phong bì công ty tiêu chuẩn. Nhiều kích thước, chất liệu giấy tốt, in logo sắc nét.' }
        ]
      }
    ],
    features: [
      { feature: 'Nhiều kích thước' },
      { feature: 'Giấy chất lượng' },
      { feature: 'In logo sắc nét' }
    ],
    pricing: {
      priceRange: 'Liên hệ',
      unit: 'Cái',
      minOrder: '100 cái'
    },
    order: 3,
    isActive: true,
    isFeatured: false,
  },
];

async function seedServicesCategories() {
  try {
    console.log('🌱 Khởi động seed 5 dịch vụ chính và các dịch vụ con...');

    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      mongoURL: process.env.MONGODB_URI,
      local: true,
    });

    console.log('✅ Payload đã khởi tạo, bắt đầu seed dữ liệu...');

    // Seed service categories
    for (const categoryData of serviceCategoriesData) {
      try {
        // Check if category already exists
        const existingCategories = await payload.find({
          collection: 'service-categories',
          where: {
            slug: {
              equals: categoryData.slug,
            },
          },
        });

        if (existingCategories.docs.length > 0) {
          // Update existing category
          const categoryId = existingCategories.docs[0].id;
          await payload.update({
            collection: 'service-categories',
            id: categoryId,
            data: categoryData,
          });
          console.log(`🔄 Đã cập nhật dịch vụ chính: ${categoryData.name}`);
        } else {
          // Create new category
          await payload.create({
            collection: 'service-categories',
            data: categoryData,
          });
          console.log(`✅ Đã tạo dịch vụ chính: ${categoryData.name}`);
        }
      } catch (error) {
        console.error(`❌ Lỗi khi xử lý dịch vụ ${categoryData.name}:`, error);
      }
    }

    // Seed services
    for (const serviceData of servicesData) {
      try {
        // Check if service already exists
        const existingServices = await payload.find({
          collection: 'service-items',
          where: {
            slug: {
              equals: serviceData.slug,
            },
          },
        });

        if (existingServices.docs.length > 0) {
          // Update existing service
          const serviceId = existingServices.docs[0].id;
          await payload.update({
            collection: 'service-items',
            id: serviceId,
            data: serviceData,
          });
          console.log(`🔄 Đã cập nhật dịch vụ con: ${serviceData.name}`);
        } else {
          // Create new service
          await payload.create({
            collection: 'service-items',
            data: serviceData,
          });
          console.log(`✅ Đã tạo dịch vụ con: ${serviceData.name}`);
        }
      } catch (error) {
        console.error(`❌ Lỗi khi xử lý dịch vụ con ${serviceData.name}:`, error);
      }
    }

    console.log('🎉 Hoàn thành seed dữ liệu dịch vụ!');
    console.log(`📊 Tổng kết:`);
    console.log(`   - ${serviceCategoriesData.length} dịch vụ chính`);
    console.log(`   - ${servicesData.length} dịch vụ con`);

  } catch (error) {
    console.error('❌ Lỗi trong quá trình seed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedServicesCategories();
