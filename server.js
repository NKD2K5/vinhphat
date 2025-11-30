const express = require('express');
const payload = require('payload');
const path = require('path');
const handleOAuthCallback = require('./payload/middleware/oauthHandler');
const axios = require('axios');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

const app = express();

console.log('Starting Payload CMS server...');

const start = async () => {
  try {
    console.log('Initializing Payload...');
    
    // ✅ Add OAuth middleware BEFORE Payload init
    app.use(handleOAuthCallback);
    
    // Initialize Payload
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'your-super-secret-payload-secret-here',
      express: app,
      onInit: async () => {
        payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      },
    });

    console.log('Payload initialized successfully!');

    // OAuth test route
    app.get('/oauth-test', (req, res) => {
      console.log('=== OAuth Test Route ===');
      console.log('Query params:', req.query);
      res.json({
        message: 'OAuth test route',
        query: req.query,
        originalUrl: req.originalUrl,
        hasAccessToken: !!req.query.access_token,
        hasCode: !!req.query.code
      });
    });

    // Debug route để xem tất cả params
    app.get('/admin/debug', (req, res) => {
      console.log('=== Admin Debug Route ===');
      console.log('Query params:', req.query);
      console.log('URL:', req.originalUrl);
      res.json({
        message: 'Admin debug route',
        query: req.query,
        originalUrl: req.originalUrl,
        hasCode: !!req.query.code,
        hasError: !!req.query.error
      });
    });

    // Frontend home route
    const homeRoute = require('./src/frontend/home');
    
    app.get('/', async (req, res, next) => {
      try {
        console.log('🔍 Accessing homepage...');
        
        const homeData = await payload.findGlobal({
          slug: 'home-page'
        });
        
        console.log('✅ CMS data:', homeData ? 'Found' : 'Not found');
        
        if (!homeData) {
          return res.status(404).send(`
            <h1>❌ No CMS Data Found</h1>
            <p>Home Global has no data yet</p>
            <a href="/admin">Go to Admin Panel to create data</a>
          `);
        }
        
        return homeRoute(req, res);
        
      } catch (error) {
        console.error('❌ Homepage error:', error);
        next(error); // Pass to error handler
      }
    });
    
    // Redirect /home to root
    app.get('/home', (req, res) => {
      res.redirect('/');
    });
    
    // Test CMS route
    app.get('/test-cms', homeRoute);
    
    // Debug route
    app.get('/debug', (req, res) => {
      res.send(`
        <h1>🔍 SERVER DEBUG</h1>
        <p><strong>Server Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>Available Routes:</strong></p>
        <ul>
          <li><a href="/">/ - Homepage CMS</a></li>
          <li><a href="/test-cms">/test-cms - Test CMS</a></li>
          <li><a href="/admin">/admin - Admin Panel</a></li>
          <li><a href="/oauth-test">/oauth-test - OAuth Test</a></li>
        </ul>
        <p><strong>Status:</strong> ✅ RUNNING</p>
      `);
    });
    
    // ✅ Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Server error:', err);
      res.status(500).send(`
        <h1>❌ Server Error</h1>
        <p><strong>Message:</strong> ${err.message}</p>
        <p><strong>Stack:</strong> <pre>${err.stack}</pre></p>
        <a href="/admin">Go to Admin Panel</a>
        <br><a href="/debug">Debug Server</a>
      `);
    });

    const PORT = process.env.PORT || 3001;
    
    app.listen(PORT, () => {
      console.log(`✓ Server listening on port ${PORT}`);
      console.log(`✓ Admin panel: http://localhost:${PORT}/admin`);
      console.log(`✓ Homepage: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Fatal error starting server:', error);
    process.exit(1);
  }
};

start();