// Authentication utilities for Google OAuth integration

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string; // Google User ID
  email_verified: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string;
  token: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7118/api';
const TOKEN_KEY = 'admin_auth_token';
const USER_KEY = 'admin_user_data';

/**
 * Đăng nhập với Google OAuth
 */
export async function loginWithGoogle(googleUser: GoogleUser): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/Auth/oauth-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleUser),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
}

/**
 * Lưu token và user data vào localStorage
 */
export function saveAuthData(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Xóa auth data khỏi localStorage
 */
export function clearAuthData(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Lấy token từ localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Lấy user data từ localStorage
 */
export function getAuthUser(): AuthUser | null {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Parse JWT token để lấy thông tin (basic implementation)
 */
export function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

/**
 * Kiểm tra token có hết hạn không
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = parseJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}

/**
 * Validate token và trả về user info
 */
export function validateToken(): AuthUser | null {
  const token = getAuthToken();
  if (!token || isTokenExpired(token)) {
    clearAuthData();
    return null;
  }

  const user = getAuthUser();
  return user;
}
