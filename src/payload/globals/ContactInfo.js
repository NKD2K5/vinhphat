// const ImageUploadField = require('../../components/ImageUploadField'); // Tạm thời comment để debug

module.exports = {
  slug: 'contact-info',
  label: 'Thông Tin Liên Hệ',
  admin: {
    group: 'Toàn thể (globals)',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      label: 'Tên công ty',
      required: true,
      defaultValue: 'Công Ty In Ấn Vĩnh Phát',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Địa chỉ',
      required: true,
      defaultValue: '123 Đường ABC, Quận 1, TP.HCM',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Điện thoại',
      required: true,
      defaultValue: '(028) 1234 5678',
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email',
      required: true,
      defaultValue: 'info@vinhphatprinting.com',
    },
    {
      name: 'hotline',
      type: 'text',
      label: 'Hotline',
      defaultValue: '0912 345 678',
    },
    {
      name: 'workingHours',
      type: 'textarea',
      label: 'Giờ làm việc',
      defaultValue: 'Thứ 2 - Thứ 6: 8:00 - 17:30\nThứ 7: 8:00 - 12:00\nChủ nhật: Nghỉ',
    },
    // Temporarily commented out due to validation error with existing data
    // {
    //   name: 'mapEmbed',
    //   type: 'textarea',
    //   label: 'Embed Map (iframe)',
    //   description: 'Dán iframe Google Maps vào đây',
    // },
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
      defaultValue: '0912 345 678',
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube URL',
      defaultValue: 'https://youtube.com/@vinhphatprinting',
    },
  ],
};
