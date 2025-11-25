const CKEditorField = require('../../../components/CKEditorFieldSafe');
const ImageUploadField = require('../../../components/ImageUploadField');
const { buildCollectionHooks } = require('../../../../payload/hooks/logrocket');

const Services = {
  slug: 'service-items',
  labels: {
    singular: 'Dịch Vụ',
    plural: 'Dịch Vụ',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'order', 'isActive'],
    group: 'Nội Dung',
    listSearchableFields: ['name', 'slug'],
  },
  access: {
    read: () => true,
  },
  hooks: buildCollectionHooks('service-items'),
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên Dịch Vụ',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug (URL)',
      admin: {
        description: 'URL-friendly version of the name (e.g., in-to-roi)',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Danh Mục',
      options: [
        {
          label: 'In Ấn Kỹ Thuật Số',
          value: 'in-an-ky-thuat-so',
        },
        {
          label: 'Thiết Kế Đồ Họa',
          value: 'thiet-ke-do-hoa',
        },
        {
          label: 'In Ấn Văn Phòng',
          value: 'in-an-van-phong',
        },
        {
          label: 'In Bao Bì & Nhãn Mác',
          value: 'in-bao-bi-nhan-mac',
        },
        {
          label: 'Hoàn Thiện Sau In',
          value: 'hoan-thien-sau-in',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô Tả Ngắn',
      admin: {
        description: '1-2 câu mô tả ngắn gọn về dịch vụ',
      },
    },
    {
      name: 'image',
      type: 'text',
      required: false,
      label: 'Hình Ảnh',
      admin: {
        components: {
          Field: ImageUploadField,
        },
        description: 'Upload ảnh qua C# API (khuyến nghị: 800x600px)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội Dung Chi Tiết',
      admin: {
        components: {
          Field: CKEditorField,
        },
        description: 'Mô tả chi tiết về dịch vụ (hiển thị trên trang chi tiết)',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Tính Năng / Ưu Điểm',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          label: 'Tính Năng',
        },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Thông Tin Giá',
      fields: [
        {
          name: 'startingPrice',
          type: 'number',
          label: 'Giá Khởi Điểm',
          admin: {
            description: 'Giá khởi điểm (VNĐ)',
          },
        },
        {
          name: 'priceNote',
          type: 'text',
          label: 'Ghi Chú Giá',
          admin: {
            description: 'VD: "Liên hệ để báo giá chi tiết"',
          },
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ Tự Hiển Thị',
      defaultValue: 0,
      admin: {
        description: 'Số thứ tự hiển thị trong danh mục (nhỏ hơn = hiển thị trước)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Kích Hoạt',
      defaultValue: true,
      admin: {
        description: 'Bỏ chọn để ẩn dịch vụ này',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Dịch Vụ Nổi Bật',
      defaultValue: false,
      admin: {
        description: 'Đánh dấu là dịch vụ nổi bật',
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

module.exports = { Services };
