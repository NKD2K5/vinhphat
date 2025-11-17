const payload = require('payload');
require('dotenv').config();

const migrateAboutPageToBlocks = async () => {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
      mongoURL: process.env.MONGODB_URI || 'mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority',
      local: true,
    });

    console.log('🔄 Migrating About Page to blocks structure...');

    // Get existing about page
    const existing = await payload.find({
      collection: 'about-page',
      limit: 1,
    });

    if (existing.docs.length === 0) {
      console.log('❌ No about page found. Creating new one...');
      
      const newAboutPage = {
        title: 'Về VinhPhat Printing',
        hero: {
          heading: 'Về VinhPhat Printing',
          subheading: 'Đối tác in ấn đáng tin cậy với hơn 15 năm kinh nghiệm',
        },
        layout: [
          {
            blockType: 'companyStory',
            heading: 'Câu Chuyện Thành Lập',
            image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
            content: [
              {
                children: [
                  {
                    text: 'Được thành lập vào năm 2009, VinhPhat Printing bắt đầu từ một xưởng in nhỏ với niềm đam mê mang đến những sản phẩm in ấn chất lượng cao cho khách hàng Việt Nam.',
                  },
                ],
              },
              {
                children: [{ text: '' }],
              },
              {
                children: [
                  {
                    text: 'Qua hơn 15 năm phát triển, chúng tôi đã trở thành một trong những đơn vị tiên phong trong lĩnh vực in ấn kỹ thuật số và in offset, phục vụ hàng ngàn khách hàng từ doanh nghiệp nhỏ đến tập đoàn lớn.',
                  },
                ],
              },
              {
                children: [{ text: '' }],
              },
              {
                children: [
                  {
                    text: 'Với đội ngũ hơn 50 nhân viên chuyên nghiệp và hệ thống máy móc hiện đại nhập khẩu từ Đức và Nhật Bản, chúng tôi cam kết mang đến sản phẩm đạt tiêu chuẩn quốc tế.',
                  },
                ],
              },
            ],
          },
          {
            blockType: 'missionVision',
            mission: {
              title: 'Sứ Mệnh',
              content: 'Mang đến những sản phẩm in ấn chất lượng cao nhất, góp phần nâng tầm thương hiệu và thành công của khách hàng thông qua công nghệ hiện đại và dịch vụ tận tâm.',
              image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
            },
            vision: {
              title: 'Tầm Nhìn',
              content: 'Trở thành công ty in ấn hàng đầu Việt Nam, được khách hàng tin tưởng lựa chọn và đối tác ưu tiên hợp tác trong lĩnh vực in ấn và truyền thông.',
              image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
            },
          },
          {
            blockType: 'coreValues',
            title: 'Giá Trị Cốt Lõi',
            values: [
              {
                title: 'Chất Lượng',
                description: 'Cam kết sản phẩm đạt tiêu chuẩn quốc tế',
                icon: 'check',
              },
              {
                title: 'Tốc Độ',
                description: 'Giao hàng nhanh chóng, đúng hẹn',
                icon: 'lightning',
              },
              {
                title: 'Tận Tâm',
                description: 'Hỗ trợ khách hàng 24/7',
                icon: 'users',
              },
              {
                title: 'Sáng Tạo',
                description: 'Luôn đổi mới và cải tiến',
                icon: 'lightbulb',
              },
            ],
          },
          {
            blockType: 'achievements',
            title: 'Thành Tựu Của Chúng Tôi',
            stats: [
              { number: '15+', label: 'Năm Kinh Nghiệm' },
              { number: '5000+', label: 'Khách Hàng Tin Tưởng' },
              { number: '50+', label: 'Nhân Viên Chuyên Nghiệp' },
              { number: '100K+', label: 'Đơn Hàng Hoàn Thành' },
            ],
          },
        ],
        seo: {
          metaTitle: 'Về VinhPhat Printing - Đối tác in ấn đáng tin cậy',
          metaDescription: 'Tìm hiểu về VinhPhat Printing - công ty in ấn hàng đầu với hơn 15 năm kinh nghiệm, đội ngũ chuyên nghiệp và công nghệ hiện đại.',
        },
      };

      await payload.create({
        collection: 'about-page',
        data: newAboutPage,
      });
      
      console.log('✅ Created new about page with blocks structure!');
    } else {
      const oldData = existing.docs[0];
      console.log('📦 Found existing about page, migrating...');

      // Convert old structure to new blocks structure
      const layout = [];

      // Company Story Block
      if (oldData.companyStory) {
        layout.push({
          blockType: 'companyStory',
          heading: oldData.companyStory.heading || 'Câu Chuyện Thành Lập',
          image: oldData.companyStory.image || '',
          content: oldData.companyStory.content || [],
        });
      }

      // Mission & Vision Block
      if (oldData.mission || oldData.vision) {
        layout.push({
          blockType: 'missionVision',
          mission: oldData.mission || {
            title: 'Sứ Mệnh',
            content: '',
            image: '',
          },
          vision: oldData.vision || {
            title: 'Tầm Nhìn',
            content: '',
            image: '',
          },
        });
      }

      // Core Values Block
      if (oldData.coreValues && oldData.coreValues.length > 0) {
        layout.push({
          blockType: 'coreValues',
          title: 'Giá Trị Cốt Lõi',
          values: oldData.coreValues,
        });
      }

      // Achievements Block
      if (oldData.achievements && oldData.achievements.length > 0) {
        layout.push({
          blockType: 'achievements',
          title: 'Thành Tựu Của Chúng Tôi',
          stats: oldData.achievements,
        });
      }

      const newData = {
        title: oldData.title,
        hero: oldData.hero,
        layout: layout,
        seo: oldData.seo,
      };

      await payload.update({
        collection: 'about-page',
        id: oldData.id,
        data: newData,
      });

      console.log('✅ Successfully migrated about page to blocks structure!');
      console.log(`📊 Created ${layout.length} blocks`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error migrating about page:', error);
    process.exit(1);
  }
};

migrateAboutPageToBlocks();
