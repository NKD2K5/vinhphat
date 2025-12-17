const express = require('express');
const payload = require('payload');
const path = require('path');
const cookieParser = require('cookie-parser');
const handleOAuthCallback = require('./payload/middleware/oauthHandler');
const axios = require('axios');
const https = require('https');

require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

const app = express();

// ✅ COOKIE PARSER PHẢI Ở TRÊN
app.use(cookieParser());

console.log('🚀 Starting Payload CMS server...');

const start = async () => {
  try {
    console.log('🔧 Initializing Payload...');

    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'payload-secret-dev',
      express: app,
      onInit: async () => {
        payload.logger.info(`✅ Payload Admin URL: ${payload.getAdminURL()}`);
      },
    });

    console.log('✅ Payload initialized successfully!');

    /**
     * ===============================
     * 🔐 AUTH MIDDLEWARE (C# SSO)
     * ===============================
     */
    app.use(async (req, res, next) => {
      try {
        // ❌ Skip asset + nội bộ Payload
        if (
          req.path.startsWith('/admin') ||
          req.path.startsWith('/api') ||
          req.path.startsWith('/assets') ||
          req.path.includes('.js') ||
          req.path.includes('.css')
        ) {
          return next();
        }

        if (!req.cookies) return next();

        const token = req.cookies?.['payload-token'];
        if (!token || req.user) return next();

        console.log('🍪 payload-token detected');

        const csharpApiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7118/api';

        const response = await axios.post(
          `${csharpApiUrl}/Auth/get-session`,
          { token },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000,
            httpsAgent: new https.Agent({
              rejectUnauthorized: false, // localhost
            }),
          }
        );

        if (!response.data?.user) return next();

        const csharpUser = response.data.user;

        const payloadUsers = await payload.find({
          collection: 'users',
          where: {
            email: { equals: csharpUser.email },
          },
          limit: 1,
        });

        if (payloadUsers.docs.length === 0) {
          console.log('⚠️ User tồn tại bên C# nhưng chưa có trong Payload');
          return next();
        }

        req.user = {
          id: payloadUsers.docs[0].id,
          email: payloadUsers.docs[0].email,
          collection: 'users',
        };

        console.log('✅ Auth OK:', csharpUser.email);
      } catch (err) {
        console.log('⚠️ C# API auth failed:', err.message);
      }

      next();
    });

    /**
     * ===============================
     * 🌐 OAUTH GOOGLE
     * ===============================
     */
    app.use(handleOAuthCallback);

    app.get('/oauth-test', (req, res) => {
      res.json({
        message: 'OAuth test',
        query: req.query,
        hasCode: !!req.query.code,
      });
    });

    app.get('/admin/debug', (req, res) => {
      res.json({
        cookies: req.cookies,
        user: req.user,
        query: req.query,
      });
    });

    /**
     * ===============================
     * 🏠 FRONTEND CMS
     * ===============================
     */
    const homeRoute = require('./src/frontend/home');

    app.get('/', async (req, res, next) => {
      try {
        const homeData = await payload.findGlobal({
          slug: 'home-page',
        });

        if (!homeData) {
          return res.status(404).send(`
            <h1>❌ No CMS Data</h1>
            <a href="/admin">Go to Admin</a>
          `);
        }

        return homeRoute(req, res);
      } catch (err) {
        next(err);
      }
    });

    app.get('/home', (_, res) => res.redirect('/'));
    app.get('/test-cms', homeRoute);

    /**
     * ===============================
     * 🧯 ERROR HANDLER
     * ===============================
     */
    app.use((err, req, res, next) => {
      console.error('❌ Server error:', err);
      res.status(500).send(`
        <h1>Server Error</h1>
        <pre>${err.message}</pre>
      `);
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🔥 Server running at http://localhost:${PORT}`);
      console.log(`🛠 Admin: http://localhost:${PORT}/admin`);
    });
  } catch (error) {
    console.error('💀 Fatal error:', error);
    process.exit(1);
  }
};

start();
