const CKEditorField = require('../../components/CKEditorFieldSafe');
const ImageUploadField = require('../../components/ImageUploadField');

exports.AboutBlock = {
  slug: 'aboutBlock',
  labels: {
    singular: 'Giới Thiệu Block',
    plural: 'Giới Thiệu Blocks',
  },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      label: 'ID Section',
      admin: {
        description: 'ID để phân biệt section (ví dụ: about, company-info)',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      required: false,
      defaultValue: 'VinhPhat Printing - Đối Tác In Ấn Đáng Tin Cậy',
      admin: {
        description: 'Để trống nếu muốn lấy từ trang Giới Thiệu',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Mô tả',
      required: false,
    },
    {
      name: 'image',
      type: 'text',
      label: 'Ảnh (URL)',
      admin: {
        description: 'Upload ảnh qua C# API',
      },
    },
    {
      name: 'primaryButton',
      type: 'group',
      label: 'Nút chính (Thông tin chi tiết)',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text',
          defaultValue: 'Thông tin chi tiết',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/gioi-thieu',
        },
      ],
    },
    {
      name: 'secondaryButton',
      type: 'group',
      label: 'Nút phụ (Liên hệ)',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text',
          defaultValue: 'Liên hệ',
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
      name: 'infoCards',
      type: 'array',
      label: 'Thẻ thông tin',
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          required: false,
        },
        {
          name: 'value',
          type: 'text',
          label: 'Giá trị',
          required: false,
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (emoji)',
          defaultValue: '✓',
        },
      ],
    },
  ],
};
