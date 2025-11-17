const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority';
const dbName = 'VinhPhat';

// Template data cho từng loại sản phẩm
const productTemplates = {
  // CATALOGUE
  'catalogue': {
    specifications: {
      material: 'Giấy couche cao cấp 150-300gsm',
      size: 'A4 (210x297mm), A5 (148x210mm), hoặc theo yêu cầu',
      colors: '4 màu CMYK, Pantone',
      printing: 'In offset chất lượng cao',
      quantity: 'Từ 100 bản trở lên',
      finishing: 'Cán màng bóng/mờ, đóng gáy xoắn/keo/dán gáy',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Catalogue là công cụ marketing quan trọng giúp doanh nghiệp giới thiệu sản phẩm, dịch vụ một cách chuyên nghiệp và ấn tượng. Với thiết kế đẹp mắt và nội dung hấp dẫn, catalogue không chỉ cung cấp thông tin mà còn tạo dấu ấn thương hiệu mạnh mẽ trong tâm trí khách hàng.' }] },
      { type: 'paragraph', children: [{ text: 'Chúng tôi cung cấp dịch vụ in catalogue với chất lượng cao nhất, sử dụng công nghệ in offset hiện đại, giấy couche cao cấp và mực in nhập khẩu. Đội ngũ thiết kế chuyên nghiệp sẽ hỗ trợ bạn tạo ra catalogue hoàn hảo, phù hợp với định hướng thương hiệu.' }] },
      { type: 'paragraph', children: [{ text: 'Quy trình in ấn được kiểm soát chặt chẽ từ khâu chuẩn bị file, hiệu chỉnh màu sắc, đến in ấn và gia công hoàn thiện. Mỗi catalogue được kiểm tra kỹ lưỡng trước khi giao đến tay khách hàng.' }] },
    ],
    features: [
      { feature: 'Chất lượng in ấn sắc nét, màu sắc chuẩn xác' },
      { feature: 'Giấy couche cao cấp, bền đẹp theo thời gian' },
      { feature: 'Đa dạng kích thước và kiểu đóng gáy' },
      { feature: 'Hỗ trợ thiết kế miễn phí cho đơn hàng lớn' },
      { feature: 'Giao hàng nhanh chóng trên toàn quốc' },
      { feature: 'Giá cả cạnh tranh, ưu đãi cho khách hàng thân thiết' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80' },
    ],
  },

  // BROCHURE
  'brochure': {
    specifications: {
      material: 'Giấy couche 150gsm, 200gsm, 250gsm',
      size: 'A4 (210x297mm), A5 (148x210mm)',
      colors: '4 màu CMYK',
      printing: 'In offset, in kỹ thuật số',
      quantity: 'Từ 50 bản',
      finishing: 'Cán màng, gấp đôi/gấp 3 chuyên nghiệp',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Brochure là giải pháp quảng cáo hiệu quả, phù hợp cho các sự kiện, hội chợ, triển lãm. Với thiết kế gấp độc đáo, brochure tạo không gian trình bày thông tin rộng rãi hơn, giúp khách hàng dễ dàng tiếp cận nội dung.' }] },
      { type: 'paragraph', children: [{ text: 'Sản phẩm được in trên giấy couche cao cấp với công nghệ in offset hoặc in kỹ thuật số, đảm bảo màu sắc sống động, hình ảnh sắc nét. Quy trình gấp chuyên nghiệp tạo nếp gấp thẳng, đẹp, tăng tính thẩm mỹ cho sản phẩm.' }] },
    ],
    features: [
      { feature: 'Thiết kế gấp độc đáo, thu hút' },
      { feature: 'In màu sắc sống động, hình ảnh sắc nét' },
      { feature: 'Giấy couche cao cấp, cán màng bóng/mờ' },
      { feature: 'Gấp chuyên nghiệp, nếp gấp thẳng đẹp' },
      { feature: 'Phù hợp cho sự kiện, hội chợ, triển lãm' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1586281380614-7c1c7f9f0fcb?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&q=80' },
    ],
  },

  // TỜ RƠI
  'tờ rơi': {
    specifications: {
      material: 'Giấy couche 150gsm, 200gsm',
      size: 'A5 (148x210mm), A4 (210x297mm)',
      colors: '4 màu CMYK',
      printing: 'In offset, in kỹ thuật số',
      quantity: 'Từ 50 tờ',
      finishing: 'Cắt thành phẩm, đóng gói',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Tờ rơi là công cụ quảng cáo phổ biến, hiệu quả cao với chi phí hợp lý. Phù hợp cho các chiến dịch marketing, quảng bá sản phẩm, dịch vụ, sự kiện.' }] },
      { type: 'paragraph', children: [{ text: 'Chúng tôi cung cấp dịch vụ in tờ rơi với nhiều lựa chọn về chất liệu, kích thước và số lượng. In offset cho số lượng lớn hoặc in kỹ thuật số cho số lượng nhỏ, giao hàng nhanh.' }] },
    ],
    features: [
      { feature: 'Chi phí hợp lý, hiệu quả cao' },
      { feature: 'Số lượng linh hoạt từ 50 tờ' },
      { feature: 'Chất lượng in ấn đảm bảo' },
      { feature: 'Giao hàng nhanh chóng' },
      { feature: 'Phù hợp cho mọi chiến dịch marketing' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80' },
    ],
  },

  // POSTER
  'poster': {
    specifications: {
      material: 'Giấy couche, giấy ảnh, PP, backlit film',
      size: 'A0, A1, A2, A3 hoặc theo yêu cầu',
      colors: '4 màu CMYK',
      printing: 'In kỹ thuật số, in UV',
      quantity: 'Từ 1 tờ',
      finishing: 'Cán màng, đóng khung, ép foam',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Poster quảng cáo là công cụ marketing trực quan, hiệu quả cao. Với kích thước lớn, màu sắc bắt mắt, poster giúp thông điệp của bạn tiếp cận đông đảo khách hàng tại các điểm bán hàng, sự kiện, hội chợ.' }] },
      { type: 'paragraph', children: [{ text: 'Chúng tôi sử dụng công nghệ in kỹ thuật số và in UV hiện đại, cho chất lượng hình ảnh sắc nét, màu sắc sống động. Đa dạng chất liệu phù hợp với mọi nhu cầu sử dụng trong nhà hoặc ngoài trời.' }] },
    ],
    features: [
      { feature: 'In kích thước lớn, từ A3 đến A0' },
      { feature: 'Công nghệ in kỹ thuật số, màu sắc sống động' },
      { feature: 'Đa dạng chất liệu phù hợp mọi môi trường' },
      { feature: 'Hỗ trợ gia công: cán màng, đóng khung, ép foam' },
      { feature: 'Giao hàng nhanh, số lượng linh hoạt từ 1 tờ' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1611162618479-ee3d24aaef0b?w=800&q=80' },
    ],
  },

  // DECAL
  'decal': {
    specifications: {
      material: 'Decal PP, decal PVC, decal trong, decal bạc',
      size: 'Theo yêu cầu khách hàng',
      colors: '4 màu CMYK',
      printing: 'In kỹ thuật số, in UV',
      quantity: 'Từ 1 tờ',
      finishing: 'Cắt theo hình, cán màng',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Decal dán là giải pháp quảng cáo linh hoạt, có thể dán trên nhiều bề mặt khác nhau: kính, tường, sàn, xe... Phù hợp cho trang trí, quảng cáo, định danh thương hiệu.' }] },
      { type: 'paragraph', children: [{ text: 'Chúng tôi cung cấp đa dạng loại decal: PP, PVC, decal trong, decal bạc... với công nghệ in kỹ thuật số cho màu sắc sống động, bền màu theo thời gian.' }] },
    ],
    features: [
      { feature: 'Đa dạng chất liệu decal' },
      { feature: 'In màu sắc sống động, bền màu' },
      { feature: 'Cắt theo hình dạng yêu cầu' },
      { feature: 'Dễ dàng thi công, dán' },
      { feature: 'Phù hợp nhiều bề mặt khác nhau' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?w=800&q=80' },
    ],
  },

  // BANNER/BACKDROP
  'banner': {
    specifications: {
      material: 'Hiflex, backlit film, canvas, PP',
      size: 'Theo yêu cầu khách hàng',
      colors: '4 màu CMYK',
      printing: 'In kỹ thuật số, in UV',
      quantity: 'Từ 1 tấm',
      finishing: 'Bấm khoen, dán khung, may viền',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Banner, backdrop là công cụ quảng cáo ngoài trời hiệu quả, phù hợp cho sự kiện, hội chợ, triển lãm, trang trí cửa hàng. Kích thước lớn, màu sắc bắt mắt thu hút sự chú ý.' }] },
      { type: 'paragraph', children: [{ text: 'Chúng tôi sử dụng chất liệu chuyên dụng: hiflex, backlit film, canvas... với công nghệ in kỹ thuật số cho hình ảnh sắc nét, màu sắc sống động, bền màu dưới ánh nắng mặt trời.' }] },
    ],
    features: [
      { feature: 'Kích thước lớn theo yêu cầu' },
      { feature: 'Chất liệu bền, chống nước' },
      { feature: 'In màu sắc sống động, bền màu' },
      { feature: 'Hỗ trợ bấm khoen, may viền' },
      { feature: 'Phù hợp sử dụng ngoài trời' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1557804483-ef3ae78eca57?w=800&q=80' },
    ],
  },

  // HỘP GIẤY
  'hộp': {
    specifications: {
      material: 'Giấy duplex, giấy ivory, giấy kraft, carton',
      size: 'Theo yêu cầu khách hàng',
      colors: '4 màu CMYK, Pantone',
      printing: 'In offset',
      quantity: 'Từ 500 hộp',
      finishing: 'Cán màng, ép kim, bế, dán hộp',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Hộp giấy cao cấp là giải pháp đóng gói chuyên nghiệp, nâng tầm giá trị sản phẩm. Với thiết kế đẹp mắt, chất liệu cao cấp, hộp giấy không chỉ bảo vệ sản phẩm mà còn tạo ấn tượng mạnh mẽ với khách hàng.' }] },
      { type: 'paragraph', children: [{ text: 'Chúng tôi chuyên sản xuất hộp giấy với đa dạng kiểu dáng: hộp nắp rời, hộp cứng, hộp gấp... Sử dụng giấy duplex, ivory, kraft cao cấp kết hợp kỹ thuật gia công hiện đại như ép kim, ép nhiệt, cán màng.' }] },
    ],
    features: [
      { feature: 'Đa dạng kiểu dáng: hộp nắp rời, hộp cứng, hộp gấp' },
      { feature: 'Chất liệu cao cấp: duplex, ivory, kraft' },
      { feature: 'Kỹ thuật gia công hiện đại: ép kim, cán màng' },
      { feature: 'Thiết kế theo yêu cầu, tạo dấu ấn thương hiệu' },
      { feature: 'Sản xuất số lượng lớn, giá cạnh tranh' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80' },
    ],
  },
};

// Hàm xác định template dựa trên tên sản phẩm
function getTemplate(productName) {
  const name = productName.toLowerCase();
  
  if (name.includes('catalogue')) return productTemplates['catalogue'];
  if (name.includes('brochure')) return productTemplates['brochure'];
  if (name.includes('tờ rơi') || name.includes('flyer')) return productTemplates['tờ rơi'];
  if (name.includes('poster')) return productTemplates['poster'];
  if (name.includes('decal')) return productTemplates['decal'];
  if (name.includes('banner') || name.includes('backdrop')) return productTemplates['banner'];
  if (name.includes('hộp') || name.includes('box')) return productTemplates['hộp'];
  
  // Default template
  return productTemplates['catalogue'];
}

async function fillAllProducts() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Đã kết nối MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection('products');

    // Lấy tất cả sản phẩm
    const products = await collection.find({}).toArray();
    console.log(`📦 Tìm thấy ${products.length} sản phẩm\n`);
    console.log('='.repeat(80));

    let updated = 0;

    for (const product of products) {
      const template = getTemplate(product.name);
      
      try {
        await collection.updateOne(
          { _id: product._id },
          { $set: template }
        );

        console.log(`✅ ${product.name}`);
        console.log(`   → Specifications: ${Object.keys(template.specifications).length} fields`);
        console.log(`   → Gallery: ${template.gallery.length} ảnh`);
        console.log(`   → Features: ${template.features.length} items`);
        console.log(`   → Detailed Info: ${template.detailedInfo.length} paragraphs\n`);
        
        updated++;
      } catch (error) {
        console.error(`❌ Lỗi khi cập nhật ${product.name}:`, error.message);
      }
    }

    console.log('='.repeat(80));
    console.log(`✅ Đã cập nhật ${updated}/${products.length} sản phẩm`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await client.close();
    console.log('\n✅ Đã đóng kết nối MongoDB');
  }
}

fillAllProducts();
