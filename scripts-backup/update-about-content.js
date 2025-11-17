const payload = require('payload');
require('dotenv').config();

const updateAboutContent = async () => {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
      mongoURL: process.env.MONGODB_URI || 'mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority',
      local: true,
    });

    console.log('Updating About Block content...');

    // Get Home page
    const homePage = await payload.find({
      collection: 'home-page',
      limit: 1,
    });

    if (homePage.docs.length === 0) {
      console.log('❌ Home page not found');
      process.exit(1);
    }

    const home = homePage.docs[0];
    console.log('Found Home page:', home.title);

    // Find About block
    const aboutBlockIndex = home.layout?.findIndex(block => block.blockType === 'aboutBlock');
    
    if (aboutBlockIndex === -1) {
      console.log('❌ About block not found in Home page');
      process.exit(1);
    }

    console.log('Found About block at index:', aboutBlockIndex);

    // New content
    const newAboutContent = {
      blockType: 'aboutBlock',
      title: 'VinhPhat Printing - Đối Tác In Ấn Đáng Tin Cậy',
      description: [
        {
          children: [
            {
              text: 'Với hơn 15 năm kinh nghiệm trong ngành in ấn, VinhPhat Printing tự hào là đơn vị tiên phong trong lĩnh vực in ấn kỹ thuật số và in offset chất lượng cao tại Việt Nam. Chúng tôi cam kết mang đến những sản phẩm in ấn hoàn hảo với công nghệ hiện đại nhất.',
            },
          ],
        },
        {
          children: [
            {
              text: '',
            },
          ],
        },
        {
          children: [
            {
              text: 'Từ catalogue, brochure, bao bì sản phẩm đến các ấn phẩm quảng cáo quy mô lớn, đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn 24/7. Với hệ thống máy móc nhập khẩu từ Đức và Nhật Bản, chúng tôi đảm bảo mỗi sản phẩm đều đạt tiêu chuẩn quốc tế về màu sắc, độ sắc nét và độ bền.',
            },
          ],
        },
        {
          children: [
            {
              text: '',
            },
          ],
        },
        {
          children: [
            {
              text: 'Hãy để VinhPhat Printing đồng hành cùng thành công của bạn!',
              bold: true,
            },
          ],
        },
      ],
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800&h=600&fit=crop',
      primaryButton: {
        text: 'Thông tin chi tiết',
        link: '/gioi-thieu',
      },
      secondaryButton: {
        text: 'Liên hệ ngay',
        link: '/lien-he',
      },
    };

    // Update layout
    const newLayout = [...home.layout];
    newLayout[aboutBlockIndex] = newAboutContent;

    // Update using raw MongoDB
    const db = payload.db.connection.db;
    const ObjectId = require('mongodb').ObjectId;
    const homeId = typeof home.id === 'string' ? new ObjectId(home.id) : home.id;

    const result = await db.collection('home-pages').updateOne(
      { _id: homeId },
      { 
        $set: { 
          layout: newLayout,
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ About block content updated successfully!');
      console.log('📝 New title:', newAboutContent.title);
      console.log('🖼️  New image:', newAboutContent.image);
    } else {
      console.log('❌ Failed to update About block');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error updating About content:', error);
    process.exit(1);
  }
};

updateAboutContent();
