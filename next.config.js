
const path = require('path');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  buildExcludes: [/middleware-manifest\.json$/],
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: false, // Tạm tắt trong development để tránh double-render
  poweredByHeader: false,
  turbopack: {}, // Add empty turbopack config
  
  // Bỏ static export để chạy được API routes
  // output: 'export',
  // trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Tắt Turbopack vì không tương thích với Payload CMS v2
  // Sử dụng Webpack thay thế
  
  // Suppress hydration warnings caused by browser extensions
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Image optimization configuration (disabled for static export)
  // images: {
  //   unoptimized: true, // Bật tối ưu hình ảnh
  //   formats: ['image/webp', 'image/avif'],
  //   deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  //   imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  //   remotePatterns: [
  //     {
  //       protocol: 'http',
  //       hostname: 'localhost',
  //       port: '3001',
  //       pathname: '/media/**',
  //     },
  //     {
  //       protocol: 'https',
  //       hostname: 'res.cloudinary.com',
  //       pathname: '/**',
  //     },
  //     {
  //       protocol: 'http',
  //       hostname: 'res.cloudinary.com',
  //       pathname: '/**',
  //     },
  //     {
  //       protocol: 'https',
  //       hostname: 'placehold.co',
  //       pathname: '/**',
  //     },
  //     {
  //       protocol: 'https',
  //       hostname: '**',
  //     },
  //   ],
  // },
  
  // Enable etag generation for better caching
  generateEtags: true,
  
  // Headers for better performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // No cache for main pages in development
        source: '/(page\\.tsx|dich-vu|san-pham|tin-tuc|contact|about|checkout|gio-hang|ve-chung-toi)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Webpack configuration
  webpack: (config, { isServer, webpack }) => {
    // Add support for MongoDB and other Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        http2: false,
        dgram: false,
        // Add Cloudinary polyfills
        stream: false,
        url: false,
        querystring: false,
        crypto: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };
      
      // Completely ignore Cloudinary modules on client-side
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^cloudinary$/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^stream$/,
          contextRegExp: /cloudinary/,
        })
      );
    }
    
    return config;
  },
  
  // Environment variables
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || 'your-super-secret-payload-secret-here',
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    NEXT_PUBLIC_PAYLOAD_URL: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001',
  },
});

// Export the config
module.exports = nextConfig;
