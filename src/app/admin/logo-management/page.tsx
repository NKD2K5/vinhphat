"use client";

import { useState, useEffect } from 'react';
import { FiUpload, FiImage, FiTrash2, FiRefreshCw, FiClock, FiCheck, FiAlertCircle, FiX } from 'react-icons/fi';
import { useLogoUpdate } from '@/hooks/useLogoUpdate';

interface LogoData {
  logo: {
    imageUrl: string;
    imageUrlDark?: string; // Thêm trường cho logo nền đen
    alt: string;
    displayMode: string;
  };
  logoMobile: {
    enabled: boolean;
    imageUrl?: string;
    imageUrlDark?: string; // Thêm trường cho logo mobile nền đen
  };
  siteInfo: {
    siteName: string;
    tagline: string;
  };
}

interface LogoHistory {
  id: string;
  action: string;
  logoUrl: string;
  alt: string;
  filename: string;
  timestamp: string;
  changedBy: {
    name: string;
    email: string;
  };
}

const LogoManagement = () => {
  const [logoData, setLogoData] = useState<LogoData | null>(null);
  const [logoHistory, setLogoHistory] = useState<LogoHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [altText, setAltText] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // States cho logo nền đen
  const [selectedDarkFile, setSelectedDarkFile] = useState<File | null>(null);
  const [previewDarkUrl, setPreviewDarkUrl] = useState<string>('');
  const [uploadType, setUploadType] = useState<'light' | 'dark'>('light');

  const { triggerLogoUpdate, updateLogoSettings } = useLogoUpdate();

  useEffect(() => {
    fetchLogoData();
    fetchLogoHistory();
  }, []);

  const fetchLogoData = async () => {
    try {
      const response = await fetch('/api/logo');
      const result = await response.json();
      
      if (result.success) {
        setLogoData(result.data);
        setAltText(result.data?.logo?.alt || '');
      }
    } catch (error) {
      console.error('Error fetching logo data:', error);
      showMessage('Không thể tải thông tin logo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogoHistory = async () => {
    try {
      const response = await fetch('/api/logo/history');
      const result = await response.json();
      
      if (result.success) {
        setLogoHistory(result.data);
      }
    } catch (error) {
      console.error('Error fetching logo history:', error);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.svg')) {
        showMessage('Chỉ chấp nhận file định dạng SVG', 'error');
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        showMessage('File vượt quá 2MB', 'error');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDarkFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.svg')) {
        showMessage('Chỉ chấp nhận file định dạng SVG', 'error');
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        showMessage('File vượt quá 2MB', 'error');
        return;
      }

      setSelectedDarkFile(file);
      const url = URL.createObjectURL(file);
      setPreviewDarkUrl(url);
    }
  };

  const handleUpload = async () => {
    const file = uploadType === 'light' ? selectedFile : selectedDarkFile;
    
    if (!file) {
      showMessage(`Vui lòng chọn file logo ${uploadType === 'light' ? 'nền trắng' : 'nền đen'}`, 'error');
      return;
    }

    setUploading(true);
    
    try {
      if (uploadType === 'light') {
        // Upload logo nền trắng bình thường
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alt', altText);
        formData.append('isDarkLogo', 'false');

        const response = await fetch('/api/logo', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          showMessage('Logo nền trắng đã được cập nhật thành công', 'success');
          triggerLogoUpdate();
          await fetchLogoData();
          await fetchLogoHistory();
          setSelectedFile(null);
          setPreviewUrl('');
        } else {
          showMessage(result.error || 'Có lỗi xảy ra', 'error');
        }
      } else {
        // Upload logo nền đen - dùng API save-dark
        const formData = new FormData();
        formData.append('file', file);
        formData.append('alt', altText);
        formData.append('isDarkLogo', 'true');

        // Upload file trước
        const uploadResponse = await fetch('/api/logo', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResult.success) {
          // Lưu URL vào config file
          const darkSaveResponse = await fetch('/api/logo/save-dark', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrlDark: uploadResult.data.logoUrl
            }),
          });

          const darkSaveResult = await darkSaveResponse.json();

          if (darkSaveResult.success) {
            showMessage('Logo nền đen đã được lưu thành công', 'success');
            triggerLogoUpdate();
            await fetchLogoData();
            await fetchLogoHistory();
            setSelectedDarkFile(null);
            setPreviewDarkUrl('');
          } else {
            showMessage(darkSaveResult.error || 'Có lỗi xảy ra', 'error');
          }
        } else {
          showMessage(uploadResult.error || 'Có lỗi xảy ra', 'error');
        }
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      showMessage('Có lỗi xảy ra, vui lòng thử lại', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRestoreDefault = async () => {
    if (!confirm('Bạn có chắc muốn khôi phục logo mặc định?')) {
      return;
    }

    try {
      const response = await fetch('/api/logo', {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        showMessage('Logo đã được khôi phục về mặc định', 'success');
        triggerLogoUpdate(); // Trigger logo update event
        await fetchLogoData();
        await fetchLogoHistory();
      } else {
        showMessage(result.error || 'Không thể khôi phục logo', 'error');
      }
    } catch (error) {
      console.error('Error restoring logo:', error);
      showMessage('Có lỗi xảy ra, vui lòng thử lại', 'error');
    }
  };

  const handleUpdateSettings = async () => {
    try {
      const settings = {
        alt: altText,
        displayMode: logoData?.logo?.displayMode || 'auto',
      };

      const result = await updateLogoSettings(settings);

      if (result.success) {
        showMessage('Cài đặt logo đã được cập nhật', 'success');
        await fetchLogoData();
      } else {
        showMessage(result.error || 'Không thể cập nhật cài đặt', 'error');
      }
    } catch (error) {
      console.error('Error updating logo settings:', error);
      showMessage('Có lỗi xảy ra, vui lòng thử lại', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Logo & Branding</h1>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <FiClock className="w-4 h-4" />
          Lịch sử thay đổi
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <FiCheck className="w-5 h-5" />
          ) : (
            <FiAlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-auto hover:opacity-70"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Logo Preview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiImage className="w-5 h-5" />
            Logo hiện tại
          </h2>
          
          {/* Logo nền trắng */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Logo (Nền trắng)</h3>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[120px]">
              {logoData?.logo?.imageUrl ? (
                <img
                  src={logoData.logo.imageUrl}
                  alt={logoData.logo.alt}
                  className="max-w-full max-h-24 object-contain"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <FiImage className="w-8 h-8 mx-auto mb-1" />
                  <p className="text-xs">Chưa có logo</p>
                </div>
              )}
            </div>
          </div>

          {/* Logo nền đen */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Logo (Nền đen)</h3>
            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center min-h-[120px]">
              {logoData?.logo?.imageUrlDark ? (
                <img
                  src={logoData.logo.imageUrlDark}
                  alt={logoData.logo.alt}
                  className="max-w-full max-h-24 object-contain"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <FiImage className="w-8 h-8 mx-auto mb-1" />
                  <p className="text-xs">Chưa có logo</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text (SEO)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VinhPhat Printing Logo"
              />
            </div>

            <button
              onClick={handleUpdateSettings}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Cập nhật thông tin
            </button>

            <button
              onClick={handleRestoreDefault}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              Khôi phục logo mặc định
            </button>
          </div>
        </div>

        {/* Upload New Logo */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiUpload className="w-5 h-5" />
            Tải lên logo mới
          </h2>

          {/* Upload Type Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại logo
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setUploadType('light')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  uploadType === 'light'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Logo nền trắng
              </button>
              <button
                onClick={() => setUploadType('dark')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  uploadType === 'dark'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Logo nền đen
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept=".svg"
                onChange={uploadType === 'light' ? handleFileSelect : handleDarkFileSelect}
                className="hidden"
                id={`logo-upload-${uploadType}`}
              />
              <label
                htmlFor={`logo-upload-${uploadType}`}
                className="cursor-pointer block"
              >
                <FiUpload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600 mb-1">Chọn file SVG</p>
                <p className="text-sm text-gray-500">Kích thước tối đa: 2MB</p>
              </label>
            </div>

            {(uploadType === 'light' ? selectedFile : selectedDarkFile) && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className={`${uploadType === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded p-4 flex items-center justify-center min-h-[100px]`}>
                    <img
                      src={uploadType === 'light' ? previewUrl : previewDarkUrl}
                      alt="Preview"
                      className="max-w-full max-h-20 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {uploadType === 'light' ? selectedFile?.name : selectedDarkFile?.name}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang tải lên...
                      </>
                    ) : (
                      <>
                        <FiUpload className="w-4 h-4" />
                        Tải lên logo {uploadType === 'light' ? 'nền trắng' : 'nền đen'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (uploadType === 'light') {
                        setSelectedFile(null);
                        setPreviewUrl('');
                      } else {
                        setSelectedDarkFile(null);
                        setPreviewDarkUrl('');
                      }
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logo History */}
      {showHistory && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiClock className="w-5 h-5" />
            Lịch sử thay đổi Logo
          </h2>

          {logoHistory.length > 0 ? (
            <div className="space-y-3">
              {logoHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                      {item.logoUrl && (
                        <img
                          src={item.logoUrl}
                          alt={item.alt}
                          className="max-w-full max-h-8 object-contain"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.action === 'upload' && 'Tải lên logo mới'}
                        {item.action === 'update' && 'Cập nhật thông tin'}
                        {item.action === 'restore' && 'Khôi phục logo mặc định'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {item.changedBy?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.changedBy?.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Chưa có lịch sử thay đổi</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LogoManagement;
