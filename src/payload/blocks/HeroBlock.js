const CKEditorField = require('../../components/CKEditorFieldSafe');
const ImageUploadField = require('../../../components/ImageUploadField');

exports.HeroBlock = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: 'Banner Slides',
      minRows: 1,
      maxRows: 10,
      admin: {
        description: 'Thêm nhiều banner slides. Nếu có nhiều hơn 1, sẽ tự động chuyển thành carousel.',
      },
      fields: [
        {
          name: 'headline',
          type: 'richText',
          label: 'Tiêu đề chính',
          required: false,
          admin: {
            components: {
              Field: CKEditorField,
            },
          },
        },
        {
          name: 'subheadline',
          type: 'richText',
          label: 'Tiêu đề phụ',
          required: false,
          admin: {
            components: {
              Field: CKEditorField,
            },
          },
        },
        {
          name: 'backgroundImage',
          type: 'text',
          label: 'Ảnh nền (URL)',
          admin: {
            components: {
              Field: ImageUploadField,
            },
            description: 'Upload ảnh qua C# API',
          },
        },
        {
          name: 'backgroundColor',
          type: 'text',
          label: 'Màu nền',
          defaultValue: '#1e40af',
          admin: {
            description: 'Màu nền nếu không có ảnh (VD: #1e40af, #dc2626)',
          },
        },
        {
          name: 'primaryCTA',
          type: 'group',
          label: 'Nút CTA chính',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Text',
              defaultValue: 'Nhận Báo Giá Ngay',
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
              defaultValue: '/lien-he',
            },
          ],
        },
        {
          name: 'secondaryCTA',
          type: 'group',
          label: 'Nút CTA phụ',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Text',
              defaultValue: 'Dịch Vụ Của Chúng Tôi',
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
              defaultValue: '/dich-vu',
            },
          ],
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Thống kê',
      minRows: 3,
      maxRows: 3,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Giá trị (VD: 15+)',
          required: false,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Nhãn',
          required: false,
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (emoji)',
          defaultValue: '📊',
        },
      ],
    },
  ],
};
