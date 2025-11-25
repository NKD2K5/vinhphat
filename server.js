const express = require('express');
const payload = require('payload');
const path = require('path');
const registerOauthRoutes = require('./payload/oauth');

require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

const app = express();

console.log('Starting Payload CMS server...');
console.log('Config path:', process.env.PAYLOAD_CONFIG_PATH || 'src/payload/payload.config.ts');

const start = async () => {
  try {
    console.log('Initializing Payload...');
    
    // Initialize Payload
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'your-super-secret-payload-secret-here',
      express: app,
      onInit: async () => {
        payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      },
    });

    console.log('Payload initialized successfully!');

    // Đăng ký OAuth routes sau khi Payload khởi tạo
    registerOauthRoutes(app, payload);

    // Add frontend routes after Payload is initialized
    const homeRoute = require('./src/frontend/home');
    
    // Add frontend route với error handling
    app.get('/', async (req, res) => {
      try {
        console.log('🔍 Truy cập trang chủ...');
        
        // Test xem payload có hoạt động không
        const homeData = await payload.findGlobal({
          slug: 'home-page'
        });
        
        console.log('✅ Lấy dữ liệu CMS thành công:', homeData ? 'Có dữ liệu' : 'Không có dữ liệu');
        
        if (!homeData) {
          return res.send(`
            <h1>❌ Không tìm thấy dữ liệu CMS</h1>
            <p>Home Global chưa có dữ liệu</p>
            <a href="/admin">Vào Admin Panel để tạo dữ liệu</a>
          `);
        }
        
        // Gọi homeRoute nếu có dữ liệu
        return homeRoute(req, res);
        
      } catch (error) {
        console.error('❌ Lỗi trang chủ:', error);
        res.status(500).send(`
          <h1>❌ Lỗi Server</h1>
          <p><strong>Chi tiết:</strong> ${error.message}</p>
          <p><strong>Stack:</strong> ${error.stack}</p>
          <a href="/admin">Vào Admin Panel</a>
          <br><a href="/debug">Debug Server</a>
        `);
      }
    });
    
    // Redirect /home to root
    app.get('/home', (_, res) => {
      res.redirect('/');
    });
    
    // Test route để kiểm tra CMS
    app.get('/test-cms', homeRoute);
    
    // Route debug
    app.get('/debug', (req, res) => {
      res.send(`
        <h1>🔍 DEBUG SERVER</h1>
        <p><strong>Server Time:</strong> ${new Date()}</p>
        <p><strong>Routes Available:</strong></p>
        <ul>
          <li><a href="/">/ - Trang chủ CMS</a></li>
          <li><a href="/test-cms">/test-cms - Test CMS</a></li>
          <li><a href="/admin">/admin - Admin Panel</a></li>
        </ul>
        <p><strong>Server Status:</strong> ✅ RUNNING</p>
      `);
    });
    
    console.log('Frontend routes added successfully!');

    app.listen(3001, async () => {
      console.log('✓ Server listening on port 3001');
      console.log('✓ Admin panel: http://localhost:3001/admin');
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

start();
