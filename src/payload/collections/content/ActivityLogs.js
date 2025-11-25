const ActivityLogs = {
  slug: 'activity-logs',
  labels: {
    singular: 'Nhật ký hệ thống',
    plural: 'Nhật ký hệ thống',
  },
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['action', 'collectionSlug', 'recordId', 'userEmail', 'timestamp'],
    group: 'Hệ Thống',
    description: 'Lịch sử thao tác của admin trên các collection quan trọng',
  },
  access: {
    // Chỉ cho phép xem trong admin, không cho tạo/sửa/xoá thủ công
    read: ({ req: { user } }) => !!user,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'action',
      type: 'select',
      label: 'Hành động',
      options: [
        { label: 'Tạo', value: 'create' },
        { label: 'Cập nhật', value: 'update' },
        { label: 'Xoá', value: 'delete' },
      ],
      required: true,
    },
    {
      name: 'collectionSlug',
      type: 'text',
      label: 'Collection',
      required: true,
    },
    {
      name: 'recordId',
      type: 'text',
      label: 'ID bản ghi',
      required: true,
    },
    {
      name: 'summary',
      type: 'text',
      label: 'Mô tả ngắn',
    },
    {
      name: 'userId',
      type: 'text',
      label: 'User ID',
    },
    {
      name: 'userEmail',
      type: 'text',
      label: 'Email',
    },
    {
      name: 'userName',
      type: 'text',
      label: 'Tên người dùng',
    },
    {
      name: 'userRole',
      type: 'text',
      label: 'Vai trò',
    },
    {
      name: 'timestamp',
      type: 'date',
      label: 'Thời gian',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'raw',
      type: 'json',
      label: 'Dữ liệu gốc',
      admin: {
        description: 'Chi tiết đầy đủ của event (chỉ dùng nội bộ)',
      },
    },
  ],
};

module.exports = { ActivityLogs };
