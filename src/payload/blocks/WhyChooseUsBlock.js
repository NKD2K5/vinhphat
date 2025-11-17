

exports.WhyChooseUsBlock = {
  slug: 'whyChooseUs',
  labels: {
    singular: 'Tại Sao Chọn Chúng Tôi',
    plural: 'Tại Sao Chọn Chúng Tôi',
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
        description: 'ID để phân biệt section (ví dụ: why-choose-us, ly-do)',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề section',
      required: true,
      defaultValue: 'Tại Sao Chọn Chúng Tôi?',
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
      name: 'reasons',
      type: 'array',
      label: 'Lý do',
      minRows: 4,
      maxRows: 8,
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (emoji)',
          required: false,
          defaultValue: '✓',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          required: false,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả ngắn',
          required: false,
        },
      ],
    },
  ],
};
