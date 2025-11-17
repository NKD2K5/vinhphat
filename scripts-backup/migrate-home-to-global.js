require('dotenv').config({ path: '.env.local' });
const payload = require('payload');

async function migrateHomeToGlobal() {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      mongoURL: process.env.MONGODB_URI,
      local: true,
    });

    console.log('🔄 Migrating Home Page from collection to global...');

    // Fetch old home page data from collection
    const oldHomePages = await payload.find({
      collection: 'home-page',
      limit: 1,
    });

    if (oldHomePages.docs && oldHomePages.docs.length > 0) {
      const oldHomePage = oldHomePages.docs[0];
      console.log('✅ Found old home page data:', oldHomePage.title);

      // Update global with old data
      await payload.updateGlobal({
        slug: 'home-page',
        data: {
          title: oldHomePage.title,
          description: oldHomePage.description,
          layout: oldHomePage.layout,
          seo: oldHomePage.seo,
        },
      });

      console.log('✅ Successfully migrated home page to global!');
    } else {
      console.log('⚠️ No old home page data found. Creating default...');
      
      // Create default home page global
      await payload.updateGlobal({
        slug: 'home-page',
        data: {
          title: 'Trang Chủ - VinhPhat Printing',
          description: 'Giải pháp in ấn chuyên nghiệp cho mọi nhu cầu',
          layout: [],
        },
      });
      
      console.log('✅ Created default home page global!');
    }

    // Migrate Contact CTA
    console.log('🔄 Migrating Contact CTA from collection to global...');
    
    const oldCTAs = await payload.find({
      collection: 'contact-cta',
      limit: 1,
      where: {
        isActive: {
          equals: true,
        },
      },
    });

    if (oldCTAs.docs && oldCTAs.docs.length > 0) {
      const oldCTA = oldCTAs.docs[0];
      console.log('✅ Found old CTA data:', oldCTA.heading);

      await payload.updateGlobal({
        slug: 'contact-cta',
        data: {
          heading: oldCTA.heading,
          description: oldCTA.description,
          primaryButton: oldCTA.primaryButton,
          secondaryButton: oldCTA.secondaryButton,
          isActive: oldCTA.isActive,
        },
      });

      console.log('✅ Successfully migrated contact CTA to global!');
    } else {
      console.log('⚠️ No old CTA data found. Creating default...');
      
      await payload.updateGlobal({
        slug: 'contact-cta',
        data: {
          heading: 'Bạn đã sẵn sàng bắt đầu dự án in ấn của mình?',
          description: 'Hãy liên hệ với chúng tôi ngay hôm nay để tư vấn miễn phí và báo giá tốt nhất! Đội ngũ chuyên gia của VinhPhat Printing luôn sẵn sàng hỗ trợ bạn 24/7.',
          primaryButton: {
            text: 'Liên Hệ Ngay',
            link: '/lien-he',
          },
          secondaryButton: {
            text: 'Xem Dịch Vụ',
            link: '/dich-vu',
          },
          isActive: true,
        },
      });
      
      console.log('✅ Created default contact CTA global!');
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateHomeToGlobal();
