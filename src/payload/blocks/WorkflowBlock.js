

exports.WorkflowBlock = {
  slug: 'workflow',
  labels: {
    singular: 'Quy Trình Làm Việc',
    plural: 'Quy Trình Làm Việc',
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
        description: 'ID để phân biệt section (ví dụ: workflow, quy-trinh)',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề section',
      required: true,
      defaultValue: 'Quy Trình Làm Việc',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Giới thiệu ngắn',
      defaultValue: 'Với quy trình chuyên nghiệp, chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng nhất.',
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Các bước',
      minRows: 4,
      maxRows: 6,
      fields: [
        {
          name: 'stepNumber',
          type: 'number',
          label: 'Số thứ tự',
          required: false,
          min: 1,
          defaultValue: 1,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề bước',
          required: false,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả',
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
