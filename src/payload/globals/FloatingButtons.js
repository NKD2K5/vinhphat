module.exports = {
  slug: 'floating-buttons',
  label: 'Nút Nổi',
  admin: {
    group: 'Toàn thể (globals)',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Kích hoạt floating buttons',
      defaultValue: true,
    },
    {
      name: 'hotlinePhone',
      type: 'text',
      label: 'Hotline Phone',
      defaultValue: '0912 345 678',
    },
    {
      name: 'zaloPhone',
      type: 'text',
      label: 'Zalo Phone',
      defaultValue: '0912 345 678',
    },
    {
      name: 'messengerUrl',
      type: 'text',
      label: 'Messenger URL',
      defaultValue: 'https://m.me/vinhphatprinting',
    },
    {
      name: 'emailAddress',
      type: 'text',
      label: 'Email Address',
      defaultValue: 'info@vinhphatprinting.com',
    },
    {
      name: 'mapUrl',
      type: 'text',
      label: 'Google Maps URL',
      defaultValue: 'https://maps.google.com/?q=VinhPhat+Printing',
      admin: {
        description: 'Địa chỉ Google Maps cho nút bản đồ',
      },
    },
  ],
};
