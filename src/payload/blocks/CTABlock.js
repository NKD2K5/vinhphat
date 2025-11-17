


exports.CTABlock = {
  slug: 'cta',
  labels: {
    singular: 'Kêu Gọi Hành Động',
    plural: 'Kêu Gọi Hành Động',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      label: 'ID Section',
      admin: {
        description: 'ID để phân biệt section (ví dụ: cta, call-to-action)',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      admin: {
        description: 'Tiêu đề chính của CTA block',
      },
    },
    {
      name: 'text',
      type: 'richText',
      label: 'Nội dung',
      required: false,
    },
    {
      name: 'primaryButton',
      type: 'group',
      label: 'Nút chính',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text',
          defaultValue: 'Liên Hệ Ngay',
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
      name: 'secondaryButton',
      type: 'group',
      label: 'Nút phụ',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text',
          defaultValue: 'Nhận Báo Giá',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/bao-gia',
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'text',
      label: 'Ảnh nền (URL)',
      admin: {
        description: 'URL ảnh nền từ Cloudinary (upload qua C# API)',
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
  ],
};
