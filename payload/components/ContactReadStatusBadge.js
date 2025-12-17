const React = require('react');

function ContactReadStatusBadge({ rowData }) {
  const isUnread = !rowData?.isRead;

  const handleClick = async (event) => {
    event.stopPropagation(); // không mở trang chi tiết khi click vào chấm

    if (!rowData?.id || !isUnread) return;

    try {
      const response = await fetch(`/api/contact-submissions/${rowData.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isRead: true,
          readAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error('❌ Failed to mark contact as read', await response.text());
        return;
      }

      // reload nhẹ để cập nhật UI
      window.location.reload();
    } catch (error) {
      console.error('❌ Error marking contact as read:', error);
    }
  };

  const baseStyle = {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    cursor: isUnread ? 'pointer' : 'default',
  };

  if (isUnread) {
    return React.createElement('span', {
      onClick: handleClick,
      style: {
        ...baseStyle,
        backgroundColor: '#10b981',
        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
      },
      title: 'Bấm để đánh dấu đã đọc',
    });
  }

  return React.createElement('span', {
    style: {
      ...baseStyle,
      width: '8px',
      height: '8px',
      backgroundColor: '#e5e7eb',
      opacity: 0.3,
    },
    title: 'Đã đọc',
  });
}

module.exports = ContactReadStatusBadge;
