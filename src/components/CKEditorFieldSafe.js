'use client';

// CKEditor Field Component - Safe Version with Better Error Handling
// This version includes comprehensive error handling and fallbacks

const React = require('react');
const { useCallback, useEffect, useRef, useState } = React;

// Import custom CSS only in browser environment
if (typeof window !== 'undefined') {
  try {
    require('./CKEditorField.css');
  } catch (e) {
    // CSS import failed, but that's okay for server-side rendering
    console.warn('Could not load CKEditorField.css:', e.message);
  }
}

const CKEditorFieldSafe = (props) => {
  // Load useField hook from Payload - MUST be called at top level
  let useFieldHook;
  let field = null;
  try {
    useFieldHook = require('payload/components/forms').useField;
    field = useFieldHook({ path: props.path });
  } catch (err) {
    console.error('Failed to load useField:', err);
  }
  
  // State management
  const [CKEditorComponent, setCKEditorComponent] = useState(null);
  const [ClassicEditorClass, setClassicEditorClass] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Get value and setValue from field
  const currentValue = field?.value || '';
  const setValue = field?.setValue;
  
  // Refs
  const editorRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const lastSavedValue = useRef(currentValue);
  
  // Load CKEditor on client side
  useEffect(() => {
    setIsClient(true);
    
    // Check dark mode
    const checkDarkMode = () => {
      const isDark = 
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        document.body.classList.contains('dark') ||
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      console.log('🌙 Dark mode detected:', isDark);
      setIsDarkMode(isDark);
      return isDark;
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['data-theme', 'class'] 
    });
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    // Load CKEditor
    import('@ckeditor/ckeditor5-react')
      .then(mod => {
        setCKEditorComponent(() => mod.CKEditor);
        return import('@ckeditor/ckeditor5-build-classic');
      })
      .then(ClassicEditorModule => {
        setClassicEditorClass(() => ClassicEditorModule.default || ClassicEditorModule);
        console.log('✓ CKEditor loaded successfully');
      })
      .catch(err => {
        console.error('Failed to load CKEditor:', err);
        setLoadError('Cannot load CKEditor: ' + err.message);
      });
    
    // Cleanup observer
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  
  // Apply dark mode styles to CKEditor after it's ready
  useEffect(() => {
    if (editorRef.current && isDarkMode) {
      const editable = editorRef.current.ui.view.editable.element;
      if (editable) {
        editable.style.backgroundColor = '#1f2937';
        editable.style.color = '#e5e7eb';
        editable.style.borderColor = '#374151';
        console.log('✓ Applied dark mode styles to CKEditor');
      }
    }
  }, [isDarkMode, editorRef.current]);
  
  // Save content with debounce
  const saveContent = useCallback((data) => {
    if (data === undefined || data === null) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    if (data === lastSavedValue.current) {
      return;
    }
    
    console.log('Scheduling save for content length:', data.length);
    
    saveTimeoutRef.current = setTimeout(() => {
      if (setValue && typeof setValue === 'function') {
        console.log('Saving content to Payload...');
        setValue(data);
        lastSavedValue.current = data;
        console.log('✓ Content saved successfully');
      } else {
        console.warn('⚠️ Cannot save: setValue is not available');
      }
    }, 500);
    
  }, [setValue]);
  
  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef(null);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Handle ESC key
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

  // Handle change
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
  
  // Handle blur
  const handleBlur = (event, editor) => {
    try {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      
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

  // Custom upload adapter
  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return {
        upload: () => {
          return loader.file.then(file => {
            return new Promise((resolve, reject) => {
              const formData = new FormData();
              formData.append('file', file);

              const apiUrl = process.env.NEXT_PUBLIC_CSHARP_API_URL || 'https://localhost:7118';
              
              console.log('Uploading image to:', `${apiUrl}/api/Upload`);

              fetch(`${apiUrl}/api/Upload`, {
                method: 'POST',
                body: formData,
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
                  resolve({ default: result.url });
                } else {
                  reject('Upload failed: No URL in response');
                }
              })
              .catch(error => {
                console.error('Upload error:', error);
                alert('Lỗi upload ảnh: ' + error.message);
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

  // Show error state
  if (loadError) {
    return React.createElement(
      'div',
      { 
        className: 'ckeditor-wrapper', 
        style: { 
          marginTop: '10px', 
          padding: '20px', 
          border: '2px solid #ff6b6b', 
          borderRadius: '8px',
          backgroundColor: '#fff5f5'
        } 
      },
      React.createElement('h3', { 
        style: { color: '#c92a2a', marginTop: 0 } 
      }, '⚠️ Lỗi tải CKEditor'),
      React.createElement('p', { 
        style: { color: '#666', marginBottom: '10px' } 
      }, loadError),
      React.createElement('p', { 
        style: { color: '#666', marginBottom: '10px' } 
      }, 'Sử dụng textarea thay thế:'),
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
        placeholder: 'Nhập nội dung HTML...',
        defaultValue: currentValue,
        onChange: (e) => saveContent(e.target.value)
      })
    );
  }

  // Show loading state
  if (!isClient || !CKEditorComponent || !ClassicEditorClass) {
    return React.createElement(
      'div',
      { 
        className: 'ckeditor-wrapper', 
        style: { 
          marginTop: '10px', 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          backgroundColor: '#f8f9fa'
        } 
      },
      React.createElement('p', { 
        style: { margin: 0, color: '#666' } 
      }, '⏳ Đang tải editor...')
    );
  }

  // Render editor
  return React.createElement(
    'div',
    { 
      ref: wrapperRef,
      className: `ckeditor-wrapper ${isFullscreen ? 'ckeditor-fullscreen' : ''}`, 
      style: { marginTop: '10px' } 
    },
    // Fullscreen button
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
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'alignment', '|',
            'link', 'bulletedList', 'numberedList', '|',
            'outdent', 'indent', '|',
            'blockQuote', 'insertTable', '|',
            'imageUpload', '|',
            'undo', 'redo'
          ],
          shouldNotGroupWhenFull: true
        },
        placeholder: 'Nhập nội dung...',
        extraPlugins: [CustomUploadAdapterPlugin],
        fontSize: {
          options: [9, 10, 11, 12, 'default', 14, 16, 18, 20, 22, 24, 26, 28, 36, 48],
          supportAllValues: true
        },
        fontFamily: {
          options: [
            'default',
            'Arial, Helvetica, sans-serif',
            'Times New Roman, Times, serif',
            'Verdana, Geneva, sans-serif'
          ],
          supportAllValues: true
        },
        alignment: {
          options: ['left', 'center', 'right', 'justify']
        },
        image: {
          toolbar: [
            'imageTextAlternative', '|',
            'imageStyle:inline',
            'imageStyle:alignLeft',
            'imageStyle:alignCenter',
            'imageStyle:alignRight'
          ]
        },
        table: {
          contentToolbar: [
            'tableColumn', 'tableRow', 'mergeTableCells'
          ]
        },
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
          ]
        }
      },
      data: typeof currentValue === 'string' ? currentValue : '',
      onChange: handleChange,
      onBlur: handleBlur,
      onReady: (editor) => {
        try {
          editorRef.current = editor;
          console.log('✓ CKEditor ready!');
          
          // Set initial data
          let initialData = '';
          if (typeof currentValue === 'string') {
            initialData = currentValue;
          }
          
          if (initialData && initialData !== editor.getData()) {
            editor.setData(initialData);
          }
          
        } catch (error) {
          console.error('Error in onReady:', error);
        }
      },
    })
  );
};

module.exports = CKEditorFieldSafe;
