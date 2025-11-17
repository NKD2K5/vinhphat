'use client';

const React = require('react');
const { Component } = React;

class CKEditorErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CKEditor Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        {
          style: {
            padding: '20px',
            margin: '10px 0',
            border: '2px solid #ff6b6b',
            borderRadius: '8px',
            backgroundColor: '#fff5f5'
          }
        },
        React.createElement('h3', { 
          style: { color: '#c92a2a', marginTop: 0 } 
        }, '⚠️ Lỗi CKEditor'),
        React.createElement('p', { 
          style: { color: '#666', marginBottom: '10px' } 
        }, 'CKEditor không thể load. Vui lòng:'),
        React.createElement('ol', { style: { color: '#666' } },
          React.createElement('li', null, 'Kiểm tra browser console (F12) để xem lỗi chi tiết'),
          React.createElement('li', null, 'Reload trang (Ctrl+R hoặc F5)'),
          React.createElement('li', null, 'Nếu vẫn lỗi, sử dụng textarea thay thế bên dưới')
        ),
        React.createElement('details', { style: { marginTop: '10px' } },
          React.createElement('summary', { 
            style: { 
              cursor: 'pointer', 
              color: '#c92a2a',
              fontWeight: 'bold'
            } 
          }, 'Chi tiết lỗi (click để xem)'),
          React.createElement('pre', { 
            style: { 
              fontSize: '12px', 
              backgroundColor: '#f8f9fa',
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto',
              marginTop: '10px'
            } 
          }, this.state.error && this.state.error.toString())
        ),
        React.createElement('hr', { style: { margin: '20px 0' } }),
        React.createElement('div', null,
          React.createElement('label', { 
            style: { 
              display: 'block', 
              fontWeight: 'bold',
              marginBottom: '5px',
              color: '#333'
            } 
          }, 'Textarea thay thế (tạm thời):'),
          React.createElement('textarea', {
            style: {
              width: '100%',
              minHeight: '200px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '14px'
            },
            placeholder: 'Nhập nội dung HTML tại đây...',
            defaultValue: this.props.value || '',
            onChange: (e) => {
              if (this.props.onChange) {
                this.props.onChange(e.target.value);
              }
            }
          })
        )
      );
    }

    return this.props.children;
  }
}

module.exports = CKEditorErrorBoundary;
