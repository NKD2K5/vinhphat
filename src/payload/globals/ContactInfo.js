const ContactInfo = {
  slug: 'contact-info',
  label: 'Thông tin liên hệ',
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user, // Chỉ admin mới sửa được
  },
  fields: [
    {
      name: 'companyInfo',
      type: 'group',
      label: 'Thông tin công ty',
      fields: [
        {
          name: 'address',
          type: 'text',
          label: 'Địa chỉ',
          required: true,
          defaultValue: 'Khu công nghiệp Thạch Khôi, Hải Dương, Việt Nam',
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
          name: 'workingHours',
          type: 'group',
          label: 'Giờ làm việc',
          fields: [
            {
              name: 'days',
              type: 'text',
              label: 'Ngày làm việc',
              defaultValue: 'Thứ Hai – Chủ Nhật',
            },
            {
              name: 'morning',
              type: 'text',
              label: 'Giờ sáng',
              defaultValue: 'Sáng 7:00–11:00',
            },
            {
              name: 'afternoon',
              type: 'text',
              label: 'Giờ chiều',
              defaultValue: 'Chiều 8:00–12:00',
            },
          ],
        },
      ],
    },
    {
      name: 'googleMaps',
      type: 'group',
      label: 'Google Maps',
      fields: [
        {
          name: 'embedUrl',
          type: 'textarea',
          label: 'Google Maps Embed URL',
          admin: {
            description: 'URL iframe từ Google Maps (Share → Embed a map)',
          },
          defaultValue: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.526365454746!2d106.2995123153738!3d20.94026299422636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a8e9a7e1f0c5d%3A0x7f8f6c1a1c3b3e1f!2sKhu%20C%C3%B4ng%20Nghi%E1%BB%87p%20Th%E1%BA%A1ch%20Kh%C3%B4i%2C%20Ph%C6%B0%E1%BB%9Dng%20Th%E1%BA%A1ch%20Kh%C3%B4i%2C%20Th%C3%A0nh%20Ph%E1%BB%91%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng%2C%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s',
        },
        {
          name: 'directionsUrl',
          type: 'text',
          label: 'Link chỉ đường',
          admin: {
            description: 'Link để mở Google Maps (Share → Copy link)',
          },
          defaultValue: 'https://www.google.com/maps/place/Khu+C%C3%B4ng+Nghi%E1%BB%87p+Th%E1%BA%A1ch+Kh%C3%B4i,+Ph%C6%B0%E1%BB%9Dng+Th%E1%BA%A1ch+Kh%C3%B4i,+Th%C3%A0nh+Ph%E1%BB%91+H%E1%BA%A3i+D%C6%B0%C6%A1ng,+H%E1%BA%A3i+D%C6%B0%C6%A1ng,+Vi%E1%BB%87t+Nam/@20.940263,106.2995123,17z',
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Mạng xã hội',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
          defaultValue: 'https://facebook.com/vinhphatprinting',
        },
        {
          name: 'gmail',
          type: 'text',
          label: 'Gmail',
          defaultValue: 'invinhphat6868@gmail.com',
        },
        {
          name: 'zalo',
          type: 'text',
          label: 'Zalo URL',
          defaultValue: 'https://zalo.me/0977344567',
        },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      label: 'Câu hỏi thường gặp (FAQ)',
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Câu hỏi',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          label: 'Câu trả lời',
          required: true,
        },
      ],
      defaultValue: [
        {
          question: 'Thời gian phản hồi liên hệ là bao lâu?',
          answer: 'Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.',
        },
        {
          question: 'Làm thế nào để đặt lịch hẹn trực tiếp?',
          answer: 'Bạn có thể gọi điện trực tiếp đến số 0977 344 567 hoặc điền vào form liên hệ để đặt lịch hẹn.',
        },
        {
          question: 'Tôi có thể gửi yêu cầu báo giá qua form này không?',
          answer: 'Được, bạn có thể gửi yêu cầu báo giá qua form liên hệ. Vui lòng cung cấp đầy đủ thông tin về yêu cầu của bạn để chúng tôi báo giá chính xác nhất.',
        },
      ],
    },
  ],
};

module.exports = { ContactInfo };
