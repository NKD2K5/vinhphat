// Simple Textarea Field - Temporary replacement for CKEditor
// This is a fallback when CKEditor fails to load

const React = require('react');

const SimpleTextareaField = (props) => {
  // Try to use Payload's useField hook
  let value = '';
  let setValue = null;
  
  try {
    const { useField } = require('payload/components/forms');
    const field = useField({ path: props.path });
    value = field.value || '';
    setValue = field.setValue;
  } catch (err) {
    console.error('Cannot load useField:', err);
  }
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (setValue && typeof setValue === 'function') {
      setValue(newValue);
    }
  };
  
  return React.createElement(
    'div',
    { style: { marginTop: '10px' } },
    React.createElement(
      'div',
      { 
        style: { 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffc107',
          borderRadius: '4px',
          marginBottom: '10px',
          fontSize: '14px'
        } 
      },
      React.createElement('strong', null, '⚠️ Chế độ Textarea đơn giản'),
      React.createElement('br'),
      React.createElement('span', null, 'CKEditor đang gặp vấn đề. Sử dụng textarea HTML thay thế.')
    ),
    React.createElement('textarea', {
      value: value,
      onChange: handleChange,
      placeholder: 'Nhập nội dung HTML...',
      style: {
        width: '100%',
        minHeight: '300px',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
        fontSize: '13px',
        lineHeight: '1.6',
        resize: 'vertical'
      }
    }),
    React.createElement(
      'div',
      { 
        style: { 
          marginTop: '8px',
          fontSize: '12px',
          color: '#666'
        } 
      },
      React.createElement('strong', null, 'Hướng dẫn:'),
      React.createElement('br'),
      '• Nhập HTML trực tiếp (VD: <p>Nội dung</p>)',
      React.createElement('br'),
      '• Sử dụng <h2>, <h3> cho tiêu đề',
      React.createElement('br'),
      '• Sử dụng <ul><li> cho danh sách',
      React.createElement('br'),
      '• Sử dụng <img src="..." alt="..."> cho hình ảnh'
    )
  );
};

module.exports = SimpleTextareaField;
