// CKEditor Field Component cho Payload CMS
// Component này sử dụng useField hook từ Payload để tích hợp đúng cách
// NOTE: Removed 'use client' directive to work with Payload CMS admin

const React = require('react');
const { useCallback, useEffect, useRef, useState } = React;

// Import custom CSS
require('./CKEditorField.css');

const CKEditorFieldComponent = (props) => {
  // Dynamically import useField to avoid SSR issues
  let useField;
  try {
    useField = require('payload/components/forms').useField;
  } catch (err) {
    console.error('Cannot load useField:', err);
  }
  
  // Sử dụng useField hook từ Payload CMS
  const { value, setValue } = useField ? useField({ path: props.path }) : { value: '', setValue: () => {} };
  const currentValue = value || '';
  const [CKEditorComponent, setCKEditorComponent] = useState(null);
  const [ClassicEditorClass, setClassicEditorClass] = useState(null);
  const [isClient, setIsClient] = useState(false);
    
  // Load CKEditor only on client-side
  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import CKEditor only on client
    import('@ckeditor/ckeditor5-react')
      .then(mod => {
        setCKEditorComponent(() => mod.CKEditor);
        return import('@ckeditor/ckeditor5-build-classic');
      })
      .then(ClassicEditorModule => {
        setClassicEditorClass(() => ClassicEditorModule.default || ClassicEditorModule);
        console.log('CKEditor loaded successfully');
      })
      .catch(err => {
        console.error('Failed to load CKEditor:', err);
      });
  }, []);
  
  console.log('CKEditor mounted:', { 
    value: typeof currentValue === 'string' ? currentValue.substring(0, 50) : typeof currentValue, 
    path: props.path, 
    hasSetValue: !!setValue,
    isClient,
    editorLoaded: !!(CKEditorComponent && ClassicEditorClass)
  });
    
  // Refs
  const editorRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const lastSavedValue = useRef(currentValue);
  
  // Hàm lưu dữ liệu với debounce
  const saveContent = useCallback((data) => {
    if (data === undefined || data === null) return;
    
    // Clear timeout hiện tại nếu có
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Nếu dữ liệu không thay đổi, không làm gì cả
    if (data === lastSavedValue.current) {
      return;
    }
    
    console.log('Scheduling save for content length:', data.length);
    
    // Đặt timeout mới
    saveTimeoutRef.current = setTimeout(() => {
      if (setValue && typeof setValue === 'function') {
        console.log('Saving content to Payload...');
        setValue(data);
        lastSavedValue.current = data;
        console.log('✓ Content saved successfully');
      } else {
        console.warn('⚠️ Cannot save: setValue is not available');
      }
    }, 500); // Debounce 500ms
    
  }, [setValue]);
    
  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
    
  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef(null);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    if (isFullscreen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Handle change từ CKEditor
  const handleChange = (event, editor) => {
    try {
      const data = editor.getData();
      if (data !== undefined) {
        saveContent(data);
      }
    } catch (error) {
      console.error('Error in handleChange:', error);
    }
  };
  
  // Handle blur để đảm bảo data được lưu khi rời khỏi editor
  const handleBlur = (event, editor) => {
    try {
      // Clear any pending saves
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      
      // Lưu ngay lập tức khi blur
      const data = editor.getData();
      if (setValue && data !== lastSavedValue.current) {
        console.log('Saving on blur...');
        setValue(data);
        lastSavedValue.current = data;
      }
    } catch (error) {
      console.error('Error in handleBlur:', error);
    }
  };

  // Custom upload adapter để upload ảnh qua C# API
  function CustomUploadAdapterPlugin(editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return {
          upload: () => {
            return loader.file.then(file => {
              return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('file', file);

                // Lấy API URL từ env hoặc dùng default
                const apiUrl = process.env.NEXT_PUBLIC_CSHARP_API_URL || 'https://localhost:7118';
                
                console.log('Uploading image to:', `${apiUrl}/api/Upload`);

                // Upload qua C# API
                fetch(`${apiUrl}/api/Upload`, {
                  method: 'POST',
                  body: formData,
                  // Thêm mode để bypass CORS trong development
                  mode: 'cors',
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  return response.json();
                })
                .then(result => {
                  console.log('Upload result:', result);
                  if (result.url) {
                    resolve({
                      default: result.url
                    });
                  } else {
                    reject('Upload failed: No URL in response');
                  }
                })
                .catch(error => {
                  console.error('Upload error:', error);
                  alert('Lỗi upload ảnh: ' + error.message + '\n\nVui lòng kiểm tra:\n1. C# API đang chạy tại ' + apiUrl + '\n2. CORS đã được cấu hình\n3. Endpoint /api/media/upload hoạt động');
                  reject(error.message);
                });
              });
            });
          },
          abort: () => {
            console.log('Upload aborted');
          }
        };
      };
    }

  // Show loading state while editor is loading
  if (!isClient || !CKEditorComponent || !ClassicEditorClass) {
    return React.createElement(
      'div',
      { className: 'ckeditor-wrapper', style: { marginTop: '10px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' } },
      React.createElement('p', { style: { margin: 0, color: '#666' } }, 'Đang tải editor...')
    );
  }

  return React.createElement(
    'div',
    { 
      ref: wrapperRef,
      className: `ckeditor-wrapper ${isFullscreen ? 'ckeditor-fullscreen' : ''}`, 
      style: { marginTop: '10px' } 
    },
    // Fullscreen toggle button
    React.createElement(
      'button',
      {
        type: 'button',
        onClick: toggleFullscreen,
        className: 'ckeditor-fullscreen-btn',
        title: isFullscreen ? 'Thoát toàn màn hình (ESC)' : 'Toàn màn hình',
        style: {
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10000,
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.2s'
        }
      },
      React.createElement('span', { 
        style: { fontSize: '16px' } 
      }, isFullscreen ? '⊗' : '⛶'),
      React.createElement('span', null, isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình')
    ),
    React.createElement(CKEditorComponent, {
        editor: ClassicEditorClass,
        config: {
          language: 'vi',
          removePlugins: ['Title'],
          toolbar: {
            items: [
              'heading', '|',
              'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
              'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '|',
              'alignment', '|',
              'link', 'bulletedList', 'numberedList', 'todoList', '|',
              'outdent', 'indent', '|',
              'blockQuote', 'insertTable', 'horizontalLine', '|',
              'imageUpload', 'mediaEmbed', '|',
              'code', 'codeBlock', '|',
              'removeFormat', '|',
              'undo', 'redo'
            ],
            shouldNotGroupWhenFull: true
          },
          placeholder: 'Nhập nội dung...',
          extraPlugins: [CustomUploadAdapterPlugin],
          // Cấu hình font size
          fontSize: {
            options: [
              9, 10, 11, 12, 'default', 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72
            ],
            supportAllValues: true
          },
          // Cấu hình font family
          fontFamily: {
            options: [
              'default',
              'Arial, Helvetica, sans-serif',
              'Courier New, Courier, monospace',
              'Georgia, serif',
              'Lucida Sans Unicode, Lucida Grande, sans-serif',
              'Tahoma, Geneva, sans-serif',
              'Times New Roman, Times, serif',
              'Trebuchet MS, Helvetica, sans-serif',
              'Verdana, Geneva, sans-serif'
            ],
            supportAllValues: true
          },
          // Cấu hình alignment
          alignment: {
            options: ['left', 'center', 'right', 'justify']
          },
          // Cấu hình image
          image: {
            toolbar: [
              'imageTextAlternative', '|',
              'imageStyle:inline',
              'imageStyle:alignLeft',
              'imageStyle:alignCenter',
              'imageStyle:alignRight', '|',
              'imageStyle:block',
              'imageStyle:side', '|',
              'linkImage'
            ],
            styles: {
              options: [
                'inline',
                'alignLeft',
                'alignCenter', 
                'alignRight',
                'block',
                'side',
                // Custom styles với width
                {
                  name: 'imageStyle25',
                  title: '25% width',
                  icon: 'left',
                  className: 'image-style-25'
                },
                {
                  name: 'imageStyle50',
                  title: '50% width',
                  icon: 'center',
                  className: 'image-style-50'
                },
                {
                  name: 'imageStyle75',
                  title: '75% width',
                  icon: 'right',
                  className: 'image-style-75'
                },
                {
                  name: 'imageStyle100',
                  title: '100% width',
                  icon: 'full',
                  className: 'image-style-100'
                }
              ]
            }
          },
          // Cấu hình table
          table: {
            contentToolbar: [
              'tableColumn', 'tableRow', 'mergeTableCells',
              'tableProperties', 'tableCellProperties'
            ]
          },
          // Cấu hình heading
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
              { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
              { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
          },
          // Fix for CKEditor 5 v42+
          typing: {
            undoStep: 20
          }
        },
        data: typeof currentValue === 'string' ? currentValue : '',
        onChange: handleChange,
        onBlur: handleBlur,
        onReady: (editor) => {
          try {
            editorRef.current = editor;
            lastSavedValue.current = currentValue;
            console.log('CKEditor 5 ready! Value type:', typeof currentValue);
            
            // Convert value to string if needed (handle legacy Slate format)
            let initialData = '';
            if (typeof currentValue === 'string') {
              initialData = currentValue;
            } else if (Array.isArray(currentValue)) {
              // Legacy Slate format - convert to empty string or basic HTML
              console.warn('Legacy Slate format detected, converting to empty string');
              initialData = '';
            } else if (currentValue && typeof currentValue === 'object') {
              console.warn('Object value detected, converting to empty string');
              initialData = '';
            }
            
            // Set initial data if needed
            if (initialData && initialData !== editor.getData()) {
              editor.setData(initialData);
            }
            
            // Safe config logging
            try {
              const config = {};
              const configKeys = ['language', 'toolbar', 'placeholder'];
              configKeys.forEach(key => {
                try {
                  config[key] = editor.config.get(key);
                } catch (e) {
                  console.log(`Could not get config.${key}:`, e.message);
                }
              });
              console.log('Editor config:', config);
            } catch (e) {
              console.log('Error getting editor config:', e.message);
            }
            
          } catch (error) {
            console.error('Error in onReady:', error);
          }
        },
    })
  );
};

// Export both default and named for compatibility
module.exports = CKEditorFieldComponent;
module.exports.default = CKEditorFieldComponent;
