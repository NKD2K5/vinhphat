const React = require('react');

// ReadStatusCell component cho Orders collection
const ReadStatusCell = (props) => {
  const { cellData } = props;
  
  return React.createElement(
    'div',
    {
      style: {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: cellData ? '#dcfce7' : '#fef2f2',
        color: cellData ? '#166534' : '#dc2626',
        textAlign: 'center',
      }
    },
    cellData ? 'Đã đọc' : 'Chưa đọc'
  );
};

module.exports = ReadStatusCell;
