const { buildConfig } = require('payload/config');
const { webpackBundler } = require('@payloadcms/bundler-webpack');
const { mongooseAdapter } = require('@payloadcms/db-mongodb');
const { slateEditor } = require('@payloadcms/richtext-slate');
const path = require('path');
const React = require('react');
const richTextConfig = require('./src/payload/editor/richTextConfig');
const { getAuthHooks } = require('./payload/hooks/logrocket');
const GoogleLoginButton = require('./payload/components/GoogleLoginButton');
const PasswordField = require('./payload/components/PasswordField');
const CustomLogin = require('./payload/components/CustomLogin');
const PasswordEyeIcon = require('./payload/components/PasswordEyeIcon');
const { AboutPage, HomePage } = require('./src/payload/collections/pages');

// Collections - Content
const { Products, News, Services, Reviews, TeamMembers, Media, ActivityLogs } = require('./src/payload/collections/content');

// Collections - Logo History
const { LogoHistory } = require('./src/payload/collections/logo');

// Collections - Taxonomy (Categories)
const { NewsCategories, ServiceCategories } = require('./src/payload/collections/taxonomy');

// Collections - Submissions
const { ContactSubmissions } = require('./src/payload/collections/submissions');
const { Orders } = require('./src/payload/collections/orders/Orders');

// Endpoints
const { markOrderAsRead } = require('./src/endpoints/markOrderAsRead');

// Globals
const { Home, ContactInfo, FooterInfo, ContactCTA, TestGlobal, FloatingButtons, SiteBranding, ImageCleanup } = require('./src/payload/globals');

module.exports = buildConfig({
  serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Vĩnh Phát',
      favicon: '/favicon.ico',
    },
    bundler: webpackBundler({
      webpack: (config) => {
        // Mark cloudinary and media-hooks as external to prevent bundling for client-side
        config.externals = config.externals || [];
        if (Array.isArray(config.externals)) {
          config.externals.push('cloudinary');
          config.externals.push('./src/collections/media-hooks');
          config.externals.push('./media-hooks');
          config.externals.push('form-data');
          config.externals.push('node-fetch');
        }
        
        // Add Node.js polyfills fallbacks
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          stream: false,
          url: false,
          querystring: false,
          http: false,
          https: false,
          crypto: false,
          zlib: false,
          buffer: false,
          util: false,
        };
        
        // Ignore node: protocol imports in client bundle
        config.resolve.alias = {
          ...config.resolve.alias,
          'node:buffer': false,
          'node:stream': false,
          'node:util': false,
        };
        
        return config;
      },
    }),
    components: {
      // Đăng ký GoogleLoginButton và PasswordEyeIcon hiển thị trên màn hình login
      beforeLogin: [GoogleLoginButton, PasswordEyeIcon],
    },
  },
  editor: richTextConfig,
  db: mongooseAdapter({
    url: process.env.MONGODB_URI,
  }),
  email: {
    fromName: 'VinhPhat Printing',
    fromAddress: process.env.EMAIL_FROM || 'noreply@vinhphatprinting.com',
    transportOptions: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    },
  },
  collections: [
    // === Users ===
    {
      slug: 'users',
      auth: true,
      labels: {
        singular: 'Người dùng',
        plural: 'Người dùng',
      },
      admin: {
        useAsTitle: 'email',
        group: 'Hệ Thống',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Tên',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          label: 'Vai trò',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
          defaultValue: 'editor',
          required: true,
        },
        {
          name: 'googleId',
          type: 'text',
          label: 'Google ID',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'avatarUrl',
          type: 'text',
          label: 'Avatar URL',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'loginAttempts',
          type: 'number',
          label: 'Số lần đăng nhập',
          defaultValue: 0,
          min: 0,
          admin: {
            readOnly: true,
          },
          hooks: {
            beforeChange: [
              ({ value, operation }) => {
                // Convert to number and handle all edge cases
                if (value === null || value === undefined || value === '') {
                  return 0;
                }
                
                const numValue = Number(value);
                
                // If conversion results in NaN, default to 0
                if (isNaN(numValue) || !isFinite(numValue)) {
                  return 0;
                }
                
                // Ensure it's not negative
                return Math.max(0, Math.floor(numValue));
              }
            ],
            beforeValidate: [
              ({ value }) => {
                // Same logic as beforeChange for extra safety
                if (value === null || value === undefined || value === '') {
                  return 0;
                }
                
                const numValue = Number(value);
                
                if (isNaN(numValue) || !isFinite(numValue)) {
                  return 0;
                }
                
                return Math.max(0, Math.floor(numValue));
              }
            ]
          },
          validate: (value) => {
            // Final validation check
            const numValue = Number(value);
            if (isNaN(numValue) || !isFinite(numValue)) {
              return 'loginAttempts must be a valid number';
            }
            if (numValue < 0) {
              return 'loginAttempts cannot be negative';
            }
            return true;
          }
        },
      ],
      hooks: getAuthHooks(),
    },
    ActivityLogs,
    LogoHistory,
    
    // === Pages ===
    // HomePage, // Tạm thởi comment để sử dụng Home global
    AboutPage,
    
    // === Content ===
    Products,
    News,
    Services,
    Reviews,
    TeamMembers,
    Media,
    
    // === Taxonomy (Categories) ===
    NewsCategories,
    ServiceCategories,
    
    // === Submissions ===
    ContactSubmissions,
    Orders,
  ],
  globals: [
    ImageCleanup, // Kích hoạt lại tool dọn dẹp ảnh
    Home, // Kích hoạt lại Home global
    ContactInfo,
    FooterInfo,
    ContactCTA,
    FloatingButtons,
    SiteBranding,
  ],
  endpoints: [
    {
      path: '/orders/:id/mark-read',
      method: 'patch',
      handler: markOrderAsRead,
    },
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
});