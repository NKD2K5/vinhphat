const ImageUploadField = require('../../../components/ImageUploadField');

exports.MissionVisionBlock = {
  slug: 'missionVision',
  labels: {
    singular: 'Sứ Mệnh & Tầm Nhìn',
    plural: 'Sứ Mệnh & Tầm Nhìn',
  },
  fields: [
    {
      name: 'mission',
      type: 'group',
      label: 'Sứ Mệnh',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          defaultValue: 'Sứ Mệnh',
        },
        {
          name: 'content',
          type: 'textarea',
          label: 'Nội dung',
          required: false,
        },
        {
          name: 'image',
          type: 'text',
          label: 'Hình ảnh',
          admin: {
            components: {
              Field: ImageUploadField,
            },
            description: 'Upload ảnh qua C# API',
          },
        },
      ],
    },
    {
      name: 'vision',
      type: 'group',
      label: 'Tầm Nhìn',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          defaultValue: 'Tầm Nhìn',
        },
        {
          name: 'content',
          type: 'textarea',
          label: 'Nội dung',
          required: false,
        },
        {
          name: 'image',
          type: 'text',
          label: 'Hình ảnh',
          admin: {
            components: {
              Field: ImageUploadField,
            },
            description: 'Upload ảnh qua C# API',
          },
        },
      ],
    },
  ],
};
