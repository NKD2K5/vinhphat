const CKEditorField = require('../../../components/CKEditorFieldSafe');
const ImageUploadField = require('../../../components/ImageUploadField');

exports.CompanyStoryBlock = {
  slug: 'companyStory',
  labels: {
    singular: 'Câu Chuyện Công Ty',
    plural: 'Câu Chuyện Công Ty',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Tiêu đề',
      defaultValue: 'Câu Chuyện Thành Lập',
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
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung',
      required: false,
      admin: {
        components: {
          Field: CKEditorField,
        },
      },
    },
  ],
};
