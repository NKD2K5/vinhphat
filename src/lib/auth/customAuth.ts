// Custom authentication utilities for C# API integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7118/api';

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  token?: string;
  message?: string;
}

export interface SessionResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
  };
  expiresAt?: string;
}

// Login với Google OAuth token
export async function loginWithGoogle(token: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/Auth/oauth-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
}

// Lấy session hiện tại
export async function getCurrentSession(): Promise<SessionResponse | null> {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/Auth/get-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, remove it
        localStorage.removeItem('auth_token');
        return null;
      }
      throw new Error('Failed to get session');
    }

    return await response.json();
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

// Lưu token và user data
export function saveAuthData(response: AuthResponse) {
  if (response.success && response.token) {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(response.user));
  }
}

// Xóa auth data
export function clearAuthData() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
}

// Lấy user data từ localStorage
export function getUserData() {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
}

// Kiểm tra đã đăng nhập chưa
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}
