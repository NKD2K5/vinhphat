const React = require('react');

function ReadStatusBadge({ rowData }) {
  const isUnread = !rowData?.isRead;
  
  if (isUnread) {
    return React.createElement('span', {
      style: {
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#10b981',
        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      title: 'Chưa đọc'
    });
  }

  return React.createElement('span', {
    style: {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#e5e7eb',
      opacity: 0.3
    },
    title: 'Đã đọc'
  });
}

// Thêm CSS animation vào head
if (typeof document !== 'undefined') {
  const styleId = 'read-status-animation';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
  }
}

module.exports = ReadStatusBadge;