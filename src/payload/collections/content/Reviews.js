
exports.Reviews = {
  slug: 'reviews',
  labels: {
    singular: 'Đánh giá',
    plural: 'Đánh giá',
  },
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'rating', 'date'],
    group: 'Nội Dung',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      label: 'Tên khách hàng',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
      label: 'Chức vụ / Công ty',
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Nội dung đánh giá',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Số sao',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'image',
      type: 'text',
      label: 'Ảnh khách hàng (URL)',
      admin: {
        description: 'Upload ảnh qua C# API',
      },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Ngày đánh giá',
      defaultValue: () => new Date().toISOString(),
    },
  ],
};
