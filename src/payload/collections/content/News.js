const CKEditorField = require('../../../components/CKEditorFieldSafe');
const ImageUploadField = require('../../../components/ImageUploadField');

exports.News = {
  slug: 'news',
  labels: {
    singular: 'Tin Tức',
    plural: 'Tin Tức',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'isFeatured'],
    group: 'Nội Dung',
    // Tắt nút Preview mặc định để chỉ sử dụng inline preview
    // preview: (doc) => {
    //   const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    //   const previewSecret = process.env.PAYLOAD_PREVIEW_SECRET || 'preview-secret';
    //   return `${baseUrl}/api/preview?secret=${previewSecret}&collection=news&slug=${doc.slug}`;
    // },
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
      label: 'Tiêu Đề',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version của tiêu đề (VD: tin-tuc-moi-nhat)',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      label: 'Danh Mục',
      relationTo: 'news-categories',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Tóm Tắt',
      required: true,
      admin: {
        description: '1-2 câu mô tả ngắn gọn về bài viết',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội Dung',
      required: true,
      admin: {
        components: {
          Field: CKEditorField,
        },
      },
    },
    {
      name: 'featuredImage',
      type: 'text',
      label: 'Ảnh Đại Diện',
      required: true,
      admin: {
        components: {
          Field: ImageUploadField,
        },
        description: 'Upload ảnh qua C# API (khuyến nghị: 1200x630px)',
      },
    },
    {
      name: 'author',
      type: 'text',
      label: 'Tác Giả',
      defaultValue: 'VinhPhat Team',
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Ngày Xuất Bản',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'readTime',
      type: 'text',
      label: 'Thời Gian Đọc',
      admin: {
        description: 'VD: "5 phút đọc"',
      },
    },
    {
      name: 'views',
      type: 'number',
      label: 'Lượt Xem',
      defaultValue: 0,
      admin: {
        description: 'Số lượt xem bài viết',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Tin Nổi Bật',
      defaultValue: false,
      admin: {
        description: 'Hiển thị ở vị trí nổi bật trên trang tin tức',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Tag',
        },
      ],
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      label: 'Bài Viết Liên Quan',
      relationTo: 'news',
      hasMany: true,
      maxRows: 6,
      admin: {
        description: 'Chọn các bài viết liên quan để hiển thị (tối đa 6 bài). Nếu để trống, hệ thống sẽ tự động chọn dựa trên category và tags.',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'SEO Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'SEO Description',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'SEO Keywords',
        },
      ],
    },
  ],
};
