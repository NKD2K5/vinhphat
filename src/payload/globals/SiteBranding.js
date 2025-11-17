// Temporarily disable custom component due to React import issues

const SiteBranding = {
  slug: 'site-branding',
  label: 'Logo & Thương Hiệu',
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user, // Chỉ admin mới sửa được
  },
  fields: [
    {
      name: 'logo',
      type: 'group',
      label: 'Logo Chính',
      fields: [
        {
          name: 'imageUrl',
          type: 'text',
          label: 'URL Logo',
          required: true,
          admin: {
            description: 'URL của logo (có thể dùng placehold.co: https://placehold.co/200x60/1e40af/ffffff?text=Logo)',
            placeholder: 'https://placehold.co/200x60/1e40af/ffffff?text=VinhPhat',
          },
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
          required: true,
          defaultValue: 'VinhPhat Printing Logo',
          admin: {
            description: 'Mô tả logo cho SEO và accessibility',
          },
        },
        {
          name: 'width',
          type: 'number',
          label: 'Chiều rộng hiển thị (px)',
          defaultValue: 180,
          admin: {
            description: 'Chiều rộng logo khi hiển thị trên website',
          },
        },
        {
          name: 'height',
          type: 'number',
          label: 'Chiều cao hiển thị (px)',
          defaultValue: 50,
          admin: {
            description: 'Chiều cao logo khi hiển thị trên website',
          },
        },
      ],
    },
    {
      name: 'logoMobile',
      type: 'group',
      label: 'Logo Mobile (Tùy chọn)',
      admin: {
        description: 'Logo riêng cho thiết bị di động (nếu khác với logo chính)',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Sử dụng logo riêng cho mobile',
          defaultValue: false,
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'URL Logo Mobile',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled,
            description: 'URL logo cho thiết bị di động',
            placeholder: 'https://your-domain.com/uploads/logo-mobile.png',
          },
        },
        {
          name: 'width',
          type: 'number',
          label: 'Chiều rộng mobile (px)',
          defaultValue: 120,
          admin: {
            condition: (data, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'height',
          type: 'number',
          label: 'Chiều cao mobile (px)',
          defaultValue: 35,
          admin: {
            condition: (data, siblingData) => siblingData?.enabled,
          },
        },
      ],
    },
    {
      name: 'favicon',
      type: 'group',
      label: 'Favicon',
      fields: [
        {
          name: 'faviconUrl',
          type: 'text',
          label: 'URL Favicon',
          admin: {
            description: 'URL favicon (khuyến nghị: ICO hoặc PNG 32x32px)',
            placeholder: 'https://your-domain.com/favicon.ico',
          },
        },
        {
          name: 'appleTouchIconUrl',
          type: 'text',
          label: 'URL Apple Touch Icon',
          admin: {
            description: 'URL icon cho iOS (khuyến nghị: PNG 180x180px)',
            placeholder: 'https://your-domain.com/apple-touch-icon.png',
          },
        },
      ],
    },
    {
      name: 'siteInfo',
      type: 'group',
      label: 'Thông Tin Website',
      fields: [
        {
          name: 'siteName',
          type: 'text',
          label: 'Tên Website',
          required: true,
          defaultValue: 'VinhPhat Printing',
        },
        {
          name: 'tagline',
          type: 'text',
          label: 'Slogan/Tagline',
          defaultValue: 'Dịch vụ in ấn chuyên nghiệp',
          admin: {
            description: 'Slogan ngắn gọn mô tả về công ty',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả Website',
          defaultValue: 'VinhPhat Printing - Chuyên cung cấp các dịch vụ in ấn chất lượng cao với hơn 15 năm kinh nghiệm trong ngành.',
          admin: {
            description: 'Mô tả chi tiết về website (dùng cho SEO)',
          },
        },
      ],
    },
    {
      name: 'colors',
      type: 'group',
      label: 'Màu Sắc Thương Hiệu',
      fields: [
        {
          name: 'primary',
          type: 'text',
          label: 'Màu Chính',
          defaultValue: '#3B82F6',
          admin: {
            description: 'Màu chính của thương hiệu (hex code, VD: #3B82F6)',
          },
        },
        {
          name: 'secondary',
          type: 'text',
          label: 'Màu Phụ',
          defaultValue: '#10B981',
          admin: {
            description: 'Màu phụ của thương hiệu (hex code)',
          },
        },
        {
          name: 'accent',
          type: 'text',
          label: 'Màu Nhấn',
          defaultValue: '#F59E0B',
          admin: {
            description: 'Màu nhấn cho các element đặc biệt (hex code)',
          },
        },
      ],
    },
  ],
};

module.exports = { SiteBranding };
