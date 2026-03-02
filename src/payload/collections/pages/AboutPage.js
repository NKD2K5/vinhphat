const CKEditorField = require('../../../components/CKEditorFieldSafe');
const ImageUploadField = require('../../../components/ImageUploadField');
const {
  CompanyStoryBlock,
  MissionVisionBlock,
  CoreValuesBlock,
  AchievementsBlock,
} = require('../../blocks/about');

exports.AboutPage = {
  slug: 'about-page',
  labels: {
    singular: 'Trang Giới Thiệu',
    plural: 'Trang Giới Thiệu',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Trang',
    hidden: false, // Đảm bảo không bị ẩn
    // Thêm vào menu để dễ thấy
    defaultColumns: ['title', 'slug'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề trang',
      required: true,
      defaultValue: 'Về VinhPhat Printing',
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      defaultValue: 'gioi-thieu',
      admin: {
        readOnly: true,
      },
    },
    
    // Hero Section
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Tiêu đề chính',
          required: true,
          defaultValue: 'Về VinhPhat Printing',
        },
        {
          name: 'subheading',
          type: 'text',
          label: 'Tiêu đề phụ',
          required: true,
          defaultValue: 'Đối tác in ấn đáng tin cậy với hơn 15 năm kinh nghiệm',
        },
      ],
    },

    // Layout Blocks - Có thể sắp xếp lại vị trí
    {
      name: 'layout',
      type: 'blocks',
      label: 'Nội dung trang (Kéo thả để sắp xếp)',
      minRows: 1,
      blocks: [
        CompanyStoryBlock,
        MissionVisionBlock,
        CoreValuesBlock,
        AchievementsBlock,
      ],
    },

    // SEO
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          maxLength: 60,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          maxLength: 160,
        },
      ],
    },
  ],
};
