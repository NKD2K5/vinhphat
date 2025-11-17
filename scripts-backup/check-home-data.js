require('dotenv').config({ path: '.env.local' });
const payload = require('payload');

async function checkHomeData() {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      mongoURL: process.env.MONGODB_URI,
      local: true,
    });

    console.log('🔍 Checking Home Page global data...\n');

    const homeData = await payload.findGlobal({
      slug: 'home-page',
    });

    console.log('📦 Home Page Data:');
    console.log('   Title:', homeData.title);
    console.log('   Layout blocks:', homeData.layout ? homeData.layout.length : 0);
    
    if (homeData.layout && homeData.layout.length > 0) {
      console.log('\n📋 Blocks found:');
      homeData.layout.forEach((block, index) => {
        console.log(`   ${index + 1}. ${block.blockType}`);
      });
    } else {
      console.log('\n⚠️  No layout blocks found!');
    }

    console.log('\n📄 Full data:');
    console.log(JSON.stringify(homeData, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkHomeData();
