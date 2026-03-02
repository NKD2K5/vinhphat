const ImageCleanup = {
  slug: 'image-cleanup',
  label: 'Dọn dẹp ảnh',
  access: {
    read: ({ req: { user } }) => !!user, // Chỉ admin đã đăng nhập
  },
  fields: [
    {
      name: 'instructions',
      type: 'ui',
      admin: {
        components: {
          Field: () => {
            const React = require('react');
            const [loading, setLoading] = React.useState(false);
            const [result, setResult] = React.useState(null);

            const runCleanup = async (liveMode) => {
              console.log('🚀 Starting cleanup, liveMode:', liveMode);
              setLoading(true);
              setResult(null);
              try {
                console.log('📡 Sending request to: http://localhost:3000/api/cleanup-images');
                const response = await fetch('http://localhost:3000/api/cleanup-images', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ liveMode }),
                });
                console.log('📡 Response status:', response.status);
                const data = await response.json();
                console.log('📡 Response data:', data);
                setResult(data);
              } catch (error) {
                console.error('❌ Error:', error);
                setResult({ success: false, message: `Lỗi: ${error.message}` });
              } finally {
                setLoading(false);
              }
            };

            return React.createElement('div', {
              style: { 
                padding: '2rem',
                maxWidth: '1200px'
              }
            }, [
              // Header
              React.createElement('div', {
                key: 'header',
                style: { 
                  marginBottom: '2rem',
                  paddingBottom: '1rem',
                  borderBottom: '2px solid var(--theme-elevation-150)'
                }
              }, [
                React.createElement('h2', {
                  key: 'title',
                  style: { 
                    fontSize: '1.75rem', 
                    fontWeight: 'bold', 
                    marginBottom: '0.5rem',
                    color: 'var(--theme-error-500)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }
                }, ['🗑️ ', 'Công cụ dọn dẹp ảnh Cloudinary']),
                
                React.createElement('p', {
                  key: 'desc',
                  style: { 
                    color: 'var(--theme-elevation-800)',
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                  }
                }, 'Tìm và xóa các ảnh không được sử dụng trong database để tiết kiệm dung lượng Cloudinary.')
              ]),
              
              // Warning Box
              React.createElement('div', {
                key: 'warning',
                style: {
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--theme-warning-50)',
                  border: '1px solid var(--theme-warning-400)',
                  borderRadius: '8px',
                  marginBottom: '1.5rem'
                }
              }, [
                React.createElement('p', {
                  key: 'warn-title',
                  style: { 
                    fontWeight: 'bold',
                    color: 'var(--theme-warning-900)',
                    marginBottom: '0.5rem',
                    fontSize: '0.95rem'
                  }
                }, '⚠️ Lưu ý quan trọng:'),
                React.createElement('ul', {
                  key: 'warn-list',
                  style: {
                    marginLeft: '1.5rem',
                    color: 'var(--theme-warning-800)',
                    fontSize: '0.9rem',
                    lineHeight: '1.8'
                  }
                }, [
                  React.createElement('li', { key: 'w1' }, 'Luôn chạy "Xem trước" trước khi xóa'),
                  React.createElement('li', { key: 'w2' }, 'Ảnh đã xóa KHÔNG THỂ khôi phục'),
                  React.createElement('li', { key: 'w3' }, 'Nên backup database trước khi xóa hàng loạt')
                ])
              ]),
              
              // Buttons
              React.createElement('div', {
                key: 'buttons',
                style: { 
                  display: 'flex', 
                  gap: '1rem', 
                  marginBottom: '2rem',
                  flexWrap: 'wrap'
                }
              }, [
                React.createElement('button', {
                  key: 'dry',
                  onClick: () => runCleanup(false),
                  disabled: loading,
                  style: {
                    padding: '0.875rem 1.75rem',
                    backgroundColor: 'var(--theme-success-500)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.6 : 1,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  },
                  onMouseEnter: (e) => !loading && (e.target.style.transform = 'translateY(-2px)'),
                  onMouseLeave: (e) => e.target.style.transform = 'translateY(0)'
                }, loading ? '⏳ Đang xử lý...' : '👁️ Xem trước (Dry Run)'),
                
                React.createElement('button', {
                  key: 'live',
                  onClick: () => runCleanup(true),
                  disabled: loading,
                  style: {
                    padding: '0.875rem 1.75rem',
                    backgroundColor: 'var(--theme-error-500)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.6 : 1,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  },
                  onMouseEnter: (e) => !loading && (e.target.style.transform = 'translateY(-2px)'),
                  onMouseLeave: (e) => e.target.style.transform = 'translateY(0)'
                }, loading ? '⏳ Đang xử lý...' : '🗑️ Xóa ngay (Live Mode)')
              ]),
              
              // Result Box
              result && React.createElement('div', {
                key: 'result',
                style: {
                  padding: '1.5rem',
                  backgroundColor: result.success ? 'var(--theme-success-50)' : 'var(--theme-error-50)',
                  border: `2px solid ${result.success ? 'var(--theme-success-400)' : 'var(--theme-error-400)'}`,
                  borderRadius: '8px',
                  marginTop: '1rem'
                }
              }, [
                React.createElement('h3', {
                  key: 'result-title',
                  style: {
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    color: result.success ? 'var(--theme-success-700)' : 'var(--theme-error-700)'
                  }
                }, result.success ? '✅ Thành công' : '❌ Lỗi'),
                
                React.createElement('pre', {
                  key: 'msg',
                  style: { 
                    whiteSpace: 'pre-wrap', 
                    margin: 0,
                    marginBottom: '1rem',
                    color: 'var(--theme-elevation-900)',
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                  }
                }, result.message),
                
                result.details && React.createElement('details', {
                  key: 'details-wrapper',
                  style: { marginTop: '1rem' }
                }, [
                  React.createElement('summary', {
                    key: 'summary',
                    style: {
                      cursor: 'pointer',
                      fontWeight: '600',
                      color: 'var(--theme-elevation-700)',
                      marginBottom: '0.5rem'
                    }
                  }, '📊 Chi tiết kỹ thuật'),
                  React.createElement('pre', {
                    key: 'details-content',
                    style: {
                      fontSize: '0.85rem',
                      padding: '1rem',
                      backgroundColor: 'var(--theme-elevation-100)',
                      borderRadius: '6px',
                      overflow: 'auto',
                      color: 'var(--theme-elevation-800)'
                    }
                  }, JSON.stringify(result.details, null, 2))
                ])
              ])
            ]);
          }
        }
      }
    }
  ],
};

module.exports = ImageCleanup;
