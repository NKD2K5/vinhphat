import { useState } from 'react';

type CloudinaryFolder = 'products' | 'news' | 'banners' | 'users' | 'media' | 'general';

interface UploadState {
  uploading: boolean;
  progress: number;
  url: string | null;
  error: string | null;
}

interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    secureUrl: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
  };
  error?: string;
}

export function useCloudinaryUpload(folder: CloudinaryFolder = 'general') {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    url: null,
    error: null,
  });

  const uploadFile = async (file: File): Promise<UploadResponse | null> => {
    setState({
      uploading: true,
      progress: 0,
      url: null,
      error: null,
    });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/cloudinary-upload', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      setState({
        uploading: false,
        progress: 100,
        url: result.data?.secureUrl || null,
        error: null,
      });

      return result;
    } catch (error: any) {
      setState({
        uploading: false,
        progress: 0,
        url: null,
        error: error.message || 'Upload failed',
      });
      return null;
    }
  };

  const reset = () => {
    setState({
      uploading: false,
      progress: 0,
      url: null,
      error: null,
    });
  };

  return {
    ...state,
    uploadFile,
    reset,
  };
}
