const FooterInfo = {
  slug: 'footer-info',
  label: 'Thông tin Footer',
  admin: {
    group: 'Toàn thể (globals)',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user, // Chỉ admin mới sửa được
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      label: 'Tên công ty',
      required: true,
      defaultValue: 'CÔNG TY TNHH IN ẤN VÀ THƯƠNG MẠI VĨNH PHÁT',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả ngắn',
      maxLength: 200,
      defaultValue: 'Chuyên cung cấp các dịch vụ in ấn chất lượng cao với hơn 15 năm kinh nghiệm trong ngành',
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Địa chỉ',
      required: true,
      defaultValue: 'Khu Công Nghiệp Thạch Khôi, Phường Thạch Khôi, Thành Phố Hải Dương, Hải Dương, Việt Nam',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Số điện thoại',
      required: true,
      defaultValue: '0977 344 567',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      defaultValue: 'invinhphat2025@gmail.com',
    },
    {
      name: 'hotline',
      type: 'text',
      label: 'Hotline',
      defaultValue: '0977 344 567',
    },
    {
      name: 'workingHours',
      type: 'textarea',
      label: 'Giờ làm việc',
      defaultValue: 'Thứ 2 - Thứ 6: 8:00 - 17:30\\nThứ 7: 8:00 - 12:00\\nChủ nhật: Nghỉ',
    },
    {
      name: 'facebookUrl',
      type: 'text',
      label: 'Facebook URL',
      defaultValue: 'https://facebook.com/vinhphatprinting',
    },
    {
      name: 'zaloPhone',
      type: 'text',
      label: 'Zalo Phone',
      defaultValue: '0977 344 567',
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube URL',
      defaultValue: 'https://youtube.com/@vinhphatprinting',
    },
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Text bản quyền',
      defaultValue: '© 2024 CÔNG TY TNHH IN ẤN VÀ THƯƠNG MẠI VĨNH PHÁT. All rights reserved.',
    },
  ],
};

module.exports = FooterInfo;
