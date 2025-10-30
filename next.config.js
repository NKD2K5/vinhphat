/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Basic image configuration
  images: {
    unoptimized: true,
  },
  
  // Disable etag generation
  generateEtags: false,
  
  // Enable Turbopack with empty config
  turbopack: {
    // Empty config to enable Turbopack
  },
  
  // Disable webpack configuration
  webpack: undefined,
}

// Export the config
module.exports = nextConfig;
