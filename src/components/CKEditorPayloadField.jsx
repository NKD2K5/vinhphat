import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useField } from 'payload/components/forms';
import './CKEditorField.css';

const CKEditorPayloadField = (props) => {
  const { path } = props;
  const { value, setValue } = useField({ path });
  
  const [editor, setEditor] = useState(null);
  const [CKEditor, setCKEditor] = useState(null);
  const [ClassicEditor, setClassicEditor] = useState(null);
  const editorRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Load CKEditor dynamically
  useEffect(() => {
    import('@ckeditor/ckeditor5-react')
      .then((mod) => {
        setCKEditor(() => mod.CKEditor);
        return import('@ckeditor/ckeditor5-build-classic');
      })
      .then((ClassicEditorModule) => {
        setClassicEditor(() => ClassicEditorModule.default || ClassicEditorModule);
      })
      .catch((err) => {
        console.error('Failed to load CKEditor:', err);
      });
  }, []);

  const saveContent = useCallback((data) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      if (setValue) {
        setValue(data);
      }
    }, 500);
  }, [setValue]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
              const apiUrl = process.env.NEXT_PUBLIC_CSHARP_API_URL || 'http://localhost:7118';
              
              console.log('🖼️ Uploading image to C# API:', `${apiUrl}/api/Upload`);
              console.log('📁 File:', file.name, '- Size:', (file.size / 1024).toFixed(2), 'KB');

              // Upload qua C# API
              fetch(`${apiUrl}/api/Upload`, {
                method: 'POST',
                body: formData,
                mode: 'cors',
              })
              .then(response => {
                console.log('📡 Response status:', response.status);
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
              })
              .then(result => {
                console.log('✅ Upload result:', result);
                if (result.url) {
                  console.log('🎉 Image uploaded successfully:', result.url);
                  resolve({
                    default: result.url
                  });
                } else {
                  console.error('❌ No URL in response');
                  reject('Upload failed: No URL in response');
                }
              })
              .catch(error => {
                console.error('❌ Upload error:', error);
                alert(
                  '⚠️ Lỗi upload ảnh qua C# API!\n\n' +
                  'Chi tiết: ' + error.message + '\n\n' +
                  'Vui lòng kiểm tra:\n' +
                  '1. C# API đang chạy tại: ' + apiUrl + '\n' +
                  '2. CORS đã được cấu hình đúng\n' +
                  '3. Endpoint /api/Upload hoạt động\n' +
                  '4. File size không quá lớn'
                );
                reject(error.message);
              });
            });
          });
        },
        abort: () => {
          console.log('⏹️ Upload aborted');
        }
      };
    };
  }

  if (!CKEditor || !ClassicEditor) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '10px' }}>
        <p style={{ margin: 0, color: '#666' }}>Đang tải editor...</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <CKEditor
        editor={ClassicEditor}
        data={value || ''}
        config={{
          language: 'vi',
          toolbar: {
            items: [
              'heading', '|',
              'bold', 'italic', 'underline', '|',
              'link', 'bulletedList', 'numberedList', '|',
              'imageUpload', 'blockQuote', 'insertTable', '|',
              'undo', 'redo'
            ]
          },
          extraPlugins: [CustomUploadAdapterPlugin],
          placeholder: 'Nhập nội dung...',
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          saveContent(data);
        }}
        onReady={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
};

export default CKEditorPayloadField;
