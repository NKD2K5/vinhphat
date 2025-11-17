const CSharpImageUpload = {
  name: 'image',
  type: 'group',
  fields: [
    {
      name: 'url',
      type: 'text',
      label: 'URL Hình Ảnh',
      required: true,
      admin: {
        description: 'URL của hình ảnh sau khi upload qua API C#',
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      admin: {
        description: 'Mô tả hình ảnh cho SEO và accessibility',
      },
    },
    {
      name: 'filename',
      type: 'text',
      label: 'Tên File',
      admin: {
        description: 'Tên file gốc',
        readOnly: true,
      },
    },
    {
      name: 'size',
      type: 'number',
      label: 'Kích Thước (bytes)',
      admin: {
        description: 'Kích thước file',
        readOnly: true,
      },
    },
  ],
};

module.exports = { CSharpImageUpload };
