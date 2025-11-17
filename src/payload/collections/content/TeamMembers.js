const ImageUploadField = require('../../../components/ImageUploadField');

exports.TeamMembers = {
  slug: 'team-members',
  labels: {
    singular: 'Thành Viên',
    plural: 'Đội Ngũ',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'order', 'isActive'],
    group: 'Nội Dung',
    listSearchableFields: ['name', 'position'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Họ và Tên',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
      label: 'Chức vụ',
      required: true,
    },
    {
      name: 'avatar',
      type: 'text',
      label: 'Ảnh đại diện',
      required: false,
      admin: {
        components: {
          Field: ImageUploadField,
        },
        description: 'Upload ảnh qua C# API (khuyến nghị: 400x400px)',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Giới thiệu ngắn',
      required: false,
      admin: {
        description: 'Mô tả ngắn về kinh nghiệm và vai trò (2-3 câu)',
      },
    },
    {
      name: 'experience',
      type: 'text',
      label: 'Kinh nghiệm',
      admin: {
        description: 'Ví dụ: 15+ năm kinh nghiệm',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Số điện thoại',
    },
    {
      name: 'linkedin',
      type: 'text',
      label: 'LinkedIn URL',
      admin: {
        description: 'Link đến profile LinkedIn',
      },
    },
    {
      name: 'facebook',
      type: 'text',
      label: 'Facebook URL',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ tự hiển thị',
      defaultValue: 0,
      admin: {
        description: 'Số thứ tự để sắp xếp (nhỏ hơn = hiển thị trước)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Hiển thị',
      defaultValue: true,
    },
  ],
};
