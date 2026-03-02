const { ActivityLogs } = require('../content');

const LogoHistory = {
  slug: 'logo-history',
  labels: {
    singular: 'Lịch Sử Logo',
    plural: 'Lịch Sử Logo',
  },
  admin: {
    useAsTitle: 'timestamp',
    defaultColumns: ['timestamp', 'action', 'logoUrl', 'changedBy'],
    group: 'Hệ Thống',
  },
  access: {
    read: ({ req: { user } }) => !!user, // Only authenticated users can read
    create: () => false, // Disable manual creation - only through hooks
    update: () => false, // Disable updates
    delete: ({ req: { user } }) => user?.role === 'admin', // Only admin can delete
  },
  fields: [
    {
      name: 'action',
      type: 'select',
      label: 'Hành động',
      required: true,
      options: [
        {
          label: 'Tải lên logo mới',
          value: 'upload',
        },
        {
          label: 'Cập nhật thông tin logo',
          value: 'update',
        },
        {
          label: 'Khôi phục logo mặc định',
          value: 'restore',
        },
      ],
      defaultValue: 'upload',
    },
    {
      name: 'logoUrl',
      type: 'text',
      label: 'URL Logo',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'filename',
      type: 'text',
      label: 'Tên File',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'fileSize',
      type: 'number',
      label: 'Kích thước File (bytes)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'changedBy',
      type: 'relationship',
      label: 'Người thay đổi',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      label: 'Thời gian thay đổi',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dateTime',
        },
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: 'Địa chỉ IP',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userAgent',
      type: 'textarea',
      label: 'User Agent',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Ghi chú',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Set the changedBy field to the current authenticated user
        if (req.user && !data.changedBy) {
          data.changedBy = req.user.id;
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        // Also log to ActivityLogs for centralized tracking
        try {
          if (req.payload) {
            await req.payload.create({
              collection: 'activity-logs',
              data: {
                action: `logo_${doc.action}`,
                details: {
                  logoHistoryId: doc.id,
                  logoUrl: doc.logoUrl,
                  action: doc.action,
                  timestamp: doc.timestamp,
                },
                changedBy: doc.changedBy,
                ipAddress: doc.ipAddress,
                userAgent: doc.userAgent,
                timestamp: new Date(),
              },
            });
          }
        } catch (error) {
          console.error('Failed to create activity log for logo change:', error);
        }
      },
    ],
  },
};

module.exports = { LogoHistory };
