const ImageUploadField = require('../../../components/ImageUploadField');

exports.HomePage = {
  slug: 'homepage',
  labels: {
    singular: 'Trang Chủ',
    plural: 'Trang Chủ',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Trang',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề trang',
      required: true,
      defaultValue: 'Trang Chủ - VinhPhat Printing',
    },
    // SEO Fields
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
          defaultValue: 'VinhPhat Printing - In Ấn Chuyên Nghiệp TP.HCM',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          maxLength: 160,
          defaultValue: 'Hơn 15 năm kinh nghiệm in ấn: Offset, Kỹ Thuật Số, Bao Bì, Catalogue.',
        },
        {
          name: 'metaKeywords',
          type: 'text',
          label: 'Meta Keywords',
          defaultValue: 'in ấn, in offset, in kỹ thuật số, in bao bì, in catalogue, in brochure',
        },
        {
          name: 'ogImage',
          type: 'text',
          label: 'OG Image (URL)',
          defaultValue: 'https://placehold.co/1200x630/1e40af/ffffff?text=VinhPhat+Printing',
          admin: {
            components: {
              Field: ImageUploadField,
            },
            description: 'Upload ảnh qua C# API',
          },
        },
      ],
    },
    // Layout Blocks - Đơn giản hóa
    {
      name: 'layout',
      type: 'array',
      label: 'Nội dung trang (có thể sắp xếp thứ tự)',
      fields: [
        {
          name: 'blockType',
          type: 'select',
          label: 'Loại Block',
          required: true,
          options: [
            { label: 'Hero Section', value: 'hero' },
            { label: 'Giới thiệu', value: 'aboutBlock' },
            { label: 'Dịch vụ', value: 'services' },
            { label: 'Sản phẩm nổi bật', value: 'featuredProducts' },
            { label: 'Quy trình làm việc', value: 'workflow' },
            { label: 'Đánh giá khách hàng', value: 'testimonials' },
            { label: 'Tin tức mới nhất', value: 'latestNews' },
            { label: 'Tại sao chọn chúng tôi', value: 'whyChooseUs' },
          ],
        },
        {
          name: 'blockName',
          type: 'text',
          label: 'Tên Block',
          admin: {
            description: 'Tên để nhận diện block trong danh sách',
          },
        },
        // Trường dữ liệu chung cho tất cả blocks
        {
          name: 'data',
          type: 'json',
          label: 'Dữ liệu Block',
          admin: {
            description: 'Dữ liệu JSON cho block này',
          },
        },
      ],
      admin: {
        components: {
          RowLabel: ({ data }) => {
            return data?.blockName || data?.blockType || 'Block chưa có tên';
          },
        },
      },
    },
  ],
};
