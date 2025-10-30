import axios from 'axios';

// Cấu hình base URL cho API
const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:4000';

// Tạo instance axios cho API
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho request
api.interceptors.request.use((config) => {
  // Thêm token xác thực nếu cần
  // const token = localStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

// Interceptor cho response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi toàn cục
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API functions
export const getPosts = async () => {
  const response = await api.get('/api/posts');
  return response.data.docs || [];
};

export const getPostBySlug = async (slug: string) => {
  const response = await api.get(`/api/posts?where[slug][equals]=${slug}`);
  return response.data.docs?.[0] || null;
};

export const getMedia = async (id: string) => {
  const response = await api.get(`/api/media/${id}`);
  return response.data;
};

export default api;



