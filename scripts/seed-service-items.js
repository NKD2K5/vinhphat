'use strict';

require('dotenv').config({ path: '.env.local' });
const payload = require('payload');

// Demo data cho collection `service-items` (Dịch Vụ)
// Categories theo menu:
//  - in-an-van-phong (In Ấn Văn Phòng)
//  - thiet-ke-do-hoa (Ấn Phẩm Tiếp Thị)
//  - in-bao-bi-nhan-mac (In Bao Bì & Nhãn Mác)
//  - hoan-thien-sau-in (Quà Tặng)
//  - in-an-ky-thuat-so (Ấn Phẩm Khác)

const serviceItemsData = [
  // IN ẤN VĂN PHÒNG
  {
    name: 'Danh Thiếp',
    slug: 'danh-thiep',
    category: 'in-an-van-phong',
    description: 'Thiết kế và in danh thiếp / name card chuyên nghiệp cho cá nhân và doanh nghiệp.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Danh thiếp là ấn phẩm không thể thiếu để tạo ấn tượng chuyên nghiệp với khách hàng và đối tác.' },
        ],
      },
    ],
    features: [
      { feature: 'Nhiều loại giấy mỹ thuật cao cấp' },
      { feature: 'In offset và in kỹ thuật số chất lượng cao' },
      { feature: 'Gia công bo góc, cán mờ / cán bóng' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Liên hệ để được báo giá chi tiết theo số lượng và chất liệu.',
    },
    order: 1,
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Giấy Tiêu Đề',
    slug: 'giay-tieu-de',
    category: 'in-an-van-phong',
    description: 'In giấy tiêu đề / letterhead đồng bộ nhận diện thương hiệu công ty.',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1000&q=80',
    order: 2,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Hóa Đơn Bán Lẻ',
    slug: 'hoa-don-ban-le',
    category: 'in-an-van-phong',
    description: 'In hóa đơn bán lẻ, phiếu xuất kho, phiếu thu chi.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1000&q=80',
    order: 3,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'In Catalogue',
    slug: 'in-catalogue',
    category: 'in-an-van-phong',
    description: 'Thiết kế và in catalogue giới thiệu sản phẩm, dịch vụ.',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1000&q=80',
    order: 4,
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'In Chứng Chỉ-Giấy Khen',
    slug: 'in-chung-chi-giay-khen',
    category: 'in-an-van-phong',
    description: 'In chứng chỉ, giấy khen cho trường học, doanh nghiệp.',
    order: 5,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'In Kẹp File-Folder',
    slug: 'in-kep-file-folder',
    category: 'in-an-van-phong',
    description: 'In kẹp file, bìa folder trình ký, hồ sơ năng lực.',
    order: 6,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'In Phong Bì-Envelope',
    slug: 'in-phong-bi-envelope',
    category: 'in-an-van-phong',
    description: 'In phong bì công ty các kích thước C5, C6, DL, A4...',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1000&q=80',
    order: 7,
    isActive: true,
    isFeatured: false,
  },

  // ẤN PHẨM TIẾP THỊ
  {
    name: 'In Áp Phích',
    slug: 'in-ap-phich',
    category: 'thiet-ke-do-hoa',
    description: 'In áp phích quảng cáo, poster cho sự kiện và chương trình khuyến mãi.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Áp phích in sắc nét, màu sắc bắt mắt giúp thu hút sự chú ý của khách hàng.' },
        ],
      },
    ],
    features: [
      { feature: 'Nhiều khổ giấy từ A3, A2, A1, A0' },
      { feature: 'In kỹ thuật số hoặc in offset' },
      { feature: 'Cán mờ, cán bóng chống nước' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Giá phụ thuộc vào kích thước và số lượng.',
    },
    order: 8,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'In Menu-Thực Đơn',
    slug: 'in-menu-thuc-don',
    category: 'thiet-ke-do-hoa',
    description: 'Thiết kế và in thực đơn cho nhà hàng, quán cà phê, quán ăn.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Menu đẹp mắt giúp tăng trải nghiệm khách hàng và thể hiện phong cách nhà hàng.' },
        ],
      },
    ],
    features: [
      { feature: 'Thiết kế theo phong cách riêng' },
      { feature: 'In trên giấy couche, giấy mỹ thuật' },
      { feature: 'Cán plastic, cán nhiệt bền đẹp' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Báo giá theo số trang và chất liệu.',
    },
    order: 9,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'In Tờ Rơi-Tờ Gấp',
    slug: 'in-to-roi-to-gap',
    category: 'thiet-ke-do-hoa',
    description: 'In tờ rơi, tờ gấp quảng cáo cho chiến dịch marketing.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Tờ rơi, tờ gấp giúp truyền tải thông điệp khuyến mãi nhanh chóng đến khách hàng.' },
        ],
      },
    ],
    features: [
      { feature: 'In nhanh số lượng ít hoặc in offset số lượng lớn' },
      { feature: 'Giấy couche / duplex, nhiều định lượng' },
      { feature: 'Thiết kế nổi bật, thu hút' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Giá phụ thuộc kích thước, 1 mặt hay 2 mặt, số lượng.',
    },
    order: 10,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Phiếu Quà Tặng',
    slug: 'phieu-qua-tang',
    category: 'thiet-ke-do-hoa',
    description: 'In phiếu quà tặng, voucher khuyến mãi cho chương trình marketing.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Phiếu quà tặng đẹp mắt giúp tăng giá trị cảm nhận và khuyến khích khách hàng quay lại.' },
        ],
      },
    ],
    features: [
      { feature: 'In trên giấy mỹ thuật cao cấp' },
      { feature: 'Đánh số serial chống giả' },
      { feature: 'Có thể gia công ép kim, cán màng' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Liên hệ để được tư vấn theo yêu cầu.',
    },
    order: 11,
    isActive: true,
    isFeatured: false,
  },

  // IN BAO BÌ & NHÃN MÁC
  {
    name: 'In Hộp Giấy',
    slug: 'in-hop-giay',
    category: 'in-bao-bi-nhan-mac',
    description: 'In hộp giấy đựng sản phẩm, quà tặng với nhiều kiểu dáng.',
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Hộp giấy in đẹp giúp bảo vệ sản phẩm và tạo ấn tượng với khách hàng khi nhận hàng.' },
        ],
      },
    ],
    features: [
      { feature: 'Nhiều kiểu hộp: hộp cứng, hộp nắp rời, hộp gấp' },
      { feature: 'Giấy duplex, ivory, kraft' },
      { feature: 'In offset 4 màu, ép kim sang trọng' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Báo giá theo kích thước và số lượng.',
    },
    order: 12,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'In Túi Giấy',
    slug: 'in-tui-giay',
    category: 'in-bao-bi-nhan-mac',
    description: 'In túi giấy đựng sản phẩm, quà tặng cho cửa hàng và thương hiệu.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Túi giấy thiết kế đẹp giúp nâng tầm hình ảnh thương hiệu khi trao tay cho khách hàng.' },
        ],
      },
    ],
    features: [
      { feature: 'Nhiều kích thước và định lượng giấy' },
      { feature: 'In 1 màu, 2 màu hoặc 4 màu' },
      { feature: 'Dây xách giấy hoặc dây dù, ruy băng' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Liên hệ để nhận tư vấn và báo giá theo mẫu.',
    },
    order: 13,
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'In Nhãn Mác Sản Phẩm',
    slug: 'in-nhan-mac-san-pham',
    category: 'in-bao-bi-nhan-mac',
    description: 'In nhãn mác treo, nhãn may, tag sản phẩm thời trang.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea1f1724?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Nhãn mác chất lượng cao thể hiện sự chuyên nghiệp và gia tăng giá trị sản phẩm.' },
        ],
      },
    ],
    features: [
      { feature: 'In trên giấy couche, giấy mỹ thuật, kraft' },
      { feature: 'Bế laser hoặc bế dao theo hình dạng' },
      { feature: 'Đục lỗ, xâu dây theo yêu cầu' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Giá phụ thuộc vào kích thước và số lượng.',
    },
    order: 14,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'In Tem Nhãn',
    slug: 'in-tem-nhan',
    category: 'in-bao-bi-nhan-mac',
    description: 'In tem nhãn, decal dán bao bì sản phẩm.',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Tem nhãn đẹp, rõ nét giúp sản phẩm nổi bật trên kệ trưng bày.' },
        ],
      },
    ],
    features: [
      { feature: 'Nhiều chất liệu decal giấy, decal nhựa, decal trong' },
      { feature: 'Bế theo hình dạng tùy ý' },
      { feature: 'Chống nước, chống trầy xước (theo yêu cầu)' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Giá dựa trên kích thước, chất liệu và số lượng.',
    },
    order: 15,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'In Phiếu Bảo Hành',
    slug: 'in-phieu-bao-hanh',
    category: 'in-bao-bi-nhan-mac',
    description: 'In phiếu bảo hành cho sản phẩm, dịch vụ bảo trì.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Phiếu bảo hành in chuyên nghiệp tạo niềm tin cho khách hàng về chất lượng sản phẩm.' },
        ],
      },
    ],
    features: [
      { feature: 'In trên giấy couche, giấy offset' },
      { feature: 'Có thể in mã QR, barcode' },
      { feature: 'Đóng gáy xoắn hoặc gấp theo yêu cầu' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Liên hệ để được tư vấn theo yêu cầu.',
    },
    order: 16,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'In Decal',
    slug: 'in-decal',
    category: 'in-bao-bi-nhan-mac',
    description: 'In decal dán kính, decal trang trí, decal quảng cáo.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Decal in chất lượng cao, bền màu, dễ dán và tháo rời khi cần.' },
        ],
      },
    ],
    features: [
      { feature: 'Decal trong, decal trắng, decal bạc' },
      { feature: 'In UV, in kỹ thuật số' },
      { feature: 'Chống nước, chống phai màu' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Giá tùy theo kích thước và chất liệu.',
    },
    order: 17,
    isActive: true,
    isFeatured: false,
  },

  // QUÀ TẶNG
  {
    name: 'Bao Lì Xì',
    slug: 'bao-li-xi',
    category: 'hoan-thien-sau-in',
    description: 'Thiết kế và in bao lì xì Tết theo thương hiệu doanh nghiệp.',
    image: 'https://images.unsplash.com/photo-1612717264219-5e15a1d64aa4?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Bao lì xì in logo công ty giúp tặng quà Tết ý nghĩa và tăng nhận diện thương hiệu.' },
        ],
      },
    ],
    features: [
      { feature: 'In trên giấy mỹ thuật cao cấp' },
      { feature: 'Nhiều kích thước và mẫu mã' },
      { feature: 'Có thể ép kim, ép nhũ sang trọng' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Báo giá theo số lượng và yêu cầu gia công.',
    },
    order: 18,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'In Lịch Tết',
    slug: 'in-lich-tet',
    category: 'hoan-thien-sau-in',
    description: 'In lịch bàn, lịch treo tường, lịch bloc làm quà tặng Tết.',
    image: 'https://images.unsplash.com/photo-1506784881475-0e408bbca849?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Lịch Tết là món quà thiết thực, giúp doanh nghiệp duy trì nhận diện suốt cả năm.' },
        ],
      },
    ],
    features: [
      { feature: 'Lịch bàn, lịch treo, lịch bloc' },
      { feature: 'Thiết kế theo phong cách thương hiệu' },
      { feature: 'In offset chất lượng cao, màu sắc chuẩn' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Liên hệ để được tư vấn mẫu và báo giá.',
    },
    order: 19,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Sổ Bìa Da',
    slug: 'so-bia-da',
    category: 'hoan-thien-sau-in',
    description: 'Sổ tay bìa da khắc logo, làm quà tặng khách hàng và nhân viên.',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Sổ bìa da sang trọng, bền đẹp là món quà tặng doanh nghiệp ý nghĩa.' },
        ],
      },
    ],
    features: [
      { feature: 'Bìa da PU hoặc da thật cao cấp' },
      { feature: 'Khắc laser logo chuyên nghiệp' },
      { feature: 'Ruột giấy chất lượng, nhiều kiểu dòng kẻ' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Báo giá theo chất liệu và số lượng.',
    },
    order: 20,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Sổ Lò Xo',
    slug: 'so-lo-xo',
    category: 'hoan-thien-sau-in',
    description: 'Sổ tay lò xo các khổ A4, A5, A6 in logo thương hiệu.',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Sổ lò xo tiện dụng cho công việc, học tập và làm quà tặng doanh nghiệp.' },
        ],
      },
    ],
    features: [
      { feature: 'Nhiều khổ giấy A4, A5, A6' },
      { feature: 'Bìa cứng hoặc bìa mềm' },
      { feature: 'In logo full màu, cán màng bóng/mờ' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Giá phụ thuộc vào kích thước và số trang.',
    },
    order: 21,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Sổ Note',
    slug: 'so-note',
    category: 'hoan-thien-sau-in',
    description: 'Sổ ghi chú, sổ note nhỏ gọn dùng trong văn phòng, sự kiện.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: 'Sổ note nhỏ gọn, tiện lợi để ghi chép nhanh và mang theo bên mình.' },
        ],
      },
    ],
    features: [
      { feature: 'Kích thước nhỏ gọn, dễ mang theo' },
      { feature: 'In logo trên bìa' },
      { feature: 'Giấy chất lượng, dễ viết' },
    ],
    pricing: {
      startingPrice: 0,
      priceNote: 'Liên hệ để được tư vấn chi tiết.',
    },
    order: 22,
    isActive: true,
    isFeatured: false,
  },

  // ẤN PHẨM KHÁC
  {
    name: 'Thiệp Chúc Mừng',
    slug: 'thiep-chuc-mung',
    category: 'in-an-ky-thuat-so',
    description: 'Thiệp chúc mừng sinh nhật, khai trương, sự kiện đặc biệt.',
    order: 23,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Thiệp Cưới',
    slug: 'thiep-cuoi',
    category: 'in-an-ky-thuat-so',
    description: 'Thiệp cưới cao cấp, nhiều phong cách thiết kế hiện đại.',
    order: 24,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Vở Học Sinh',
    slug: 'vo-hoc-sinh',
    category: 'in-an-ky-thuat-so',
    description: 'In vở học sinh cho trường học, trung tâm ngoại ngữ, thương hiệu.',
    order: 25,
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Wobbler',
    slug: 'wobbler',
    category: 'in-an-ky-thuat-so',
    description: 'In wobbler quảng cáo treo kệ trưng bày sản phẩm.',
    order: 26,
    isActive: true,
    isFeatured: false,
  },
];

async function seedServiceItems() {
  try {
    console.log('🌱 Khởi động seed dữ liệu Dịch Vụ (service-items)...');

    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      mongoURL: process.env.MONGODB_URI,
      local: true,
    });

    console.log('✅ Payload đã khởi tạo, bắt đầu tạo/cập nhật dịch vụ...');

    for (const serviceData of serviceItemsData) {
      try {
        const existing = await payload.find({
          collection: 'service-items',
          where: {
            slug: {
              equals: serviceData.slug,
            },
          },
          limit: 1,
        });

        if (existing.docs && existing.docs.length > 0) {
          const id = existing.docs[0].id;
          await payload.update({
            collection: 'service-items',
            id,
            data: serviceData,
          });
          console.log(`🔁 Đã cập nhật dịch vụ: ${serviceData.name}`);
        } else {
          await payload.create({
            collection: 'service-items',
            data: serviceData,
          });
          console.log(`➕ Đã tạo mới dịch vụ: ${serviceData.name}`);
        }
      } catch (error) {
        console.error(`❌ Lỗi khi xử lý dịch vụ ${serviceData.name}:`, error?.message || error);
      }
    }

    console.log('🎉 Hoàn thành seed dữ liệu Dịch Vụ (service-items)!');
    console.log(`📊 Tổng số dịch vụ: ${serviceItemsData.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi trong quá trình seed Dịch Vụ:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedServiceItems();
}