// Enable custom components for image upload
const ImageUploadField = require('../../components/ImageUploadField');

const SiteBranding = {
  slug: 'site-branding',
  label: 'Nhận Diện Website',
  admin: {
    group: 'Toàn thể (globals)',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Tên website',
      required: true,
      defaultValue: 'Vĩnh Phát Printing',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      label: 'Mô tả website',
      defaultValue: 'Công ty in ấn chuyên nghiệp tại TP.HCM',
    },
    {
      name: 'logo',
      type: 'group',
      label: 'Logo',
      fields: [
        {
          name: 'primary',
          type: 'text',
          label: 'Logo chính',
          admin: {
            components: {
              Field: ImageUploadField,
            },
            description: 'Upload logo qua C# API hoặc dán URL trực tiếp',
            placeholder: 'https://res.cloudinary.com/your-account/logo.png'
          },
        },
        {
          name: 'favicon',
          type: 'text',
          label: 'Favicon',
          admin: {
            components: {
              Field: ImageUploadField,
            },
            description: 'Upload favicon qua C# API hoặc dán URL trực tiếp',
            placeholder: 'https://res.cloudinary.com/your-account/favicon.ico'
          },
        },
        {
          name: 'mobileLogo',
          type: 'text',
          label: 'Logo mobile',
          admin: {
            components: {
              Field: ImageUploadField,
            },
            description: 'Upload logo mobile qua C# API hoặc dán URL trực tiếp',
            placeholder: 'https://res.cloudinary.com/your-account/logo-mobile.png'
          },
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO mặc định',
      fields: [
        {
          name: 'defaultTitle',
          type: 'text',
          label: 'Tiêu đề mặc định',
          defaultValue: 'Vĩnh Phát Printing - In Ấn Chuyên Nghiệp',
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
          label: 'Mô tả mặc định',
          defaultValue: 'Công ty in ấn Vĩnh Phát chuyên cung cấp dịch vụ in ấn chất lượng cao tại TP.HCM',
        },
        {
          name: 'defaultKeywords',
          type: 'text',
          label: 'Keywords mặc định',
          defaultValue: 'in ấn, in ấn tphcm, công ty in ấn, vĩnh phát printing',
        },
        {
          name: 'ogImage',
          type: 'text',
          label: 'OG Image mặc định',
          admin: {
            components: {
              Field: ImageUploadField,
            },
            description: 'Upload ảnh qua C# API hoặc dán URL trực tiếp',
            placeholder: 'https://res.cloudinary.com/your-account/og-image.jpg'
          },
        },
      ],
    },
  ],
};

module.exports = SiteBranding;
