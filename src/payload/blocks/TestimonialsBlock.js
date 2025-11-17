const ImageUploadField = require('../../components/ImageUploadField');

exports.TestimonialsBlock = {
  slug: 'testimonials',
  labels: {
    singular: 'Đánh Giá Khách Hàng',
    plural: 'Đánh Giá Khách Hàng',
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
        description: 'ID để phân biệt section (ví dụ: testimonials, danh-gia)',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề section',
      required: true,
      defaultValue: 'Khách Hàng Nói Về Chúng Tôi',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Tiêu đề phụ',
      admin: {
        description: 'Mô tả ngắn về section',
      },
    },
    {
      name: 'testimonials',
      type: 'array',
      label: 'Danh sách đánh giá',
      minRows: 3,
      maxRows: 12,
      fields: [
        {
          name: 'customerName',
          type: 'text',
          label: 'Tên khách hàng',
          required: false,
        },
        {
          name: 'position',
          type: 'text',
          label: 'Chức vụ',
        },
        {
          name: 'company',
          type: 'text',
          label: 'Công ty',
        },
        {
          name: 'content',
          type: 'textarea',
          label: 'Nội dung đánh giá',
          required: false,
        },
        {
          name: 'rating',
          type: 'number',
          label: 'Số sao',
          required: false,
          min: 1,
          max: 5,
          defaultValue: 5,
        },
        {
          name: 'image',
          type: 'text',
          label: 'Ảnh khách hàng (URL)',
          admin: {
            components: {
              Field: ImageUploadField,
            },
            description: 'Upload ảnh qua C# API',
          },
        },
        {
          name: 'avatar',
          type: 'text',
          label: 'Avatar (URL)',
          admin: {
            components: {
              Field: ImageUploadField,
            },
            description: 'Upload ảnh qua C# API (thay thế cho image)',
          },
        },
      ],
    },
  ],
};
