// @ts-nocheck
import React, { useState } from 'react';
import { useAuth } from 'payload/components/hooks';
import { Button, Text, Form } from 'payload/components';
import { AuthenticationError } from 'payload/dist/errors';
import { useRouter } from 'payload/components/hooks';

const NEXT_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const baseClass = 'auth';

const CustomLogin = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);

    // Redirect đến NextAuth Google login
    const nextAuthUrl = `${NEXT_APP_URL}/api/auth/signin/google`;
    window.location.href = nextAuthUrl;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      await login(data);
      router.push('/admin');
    } catch (err) {
      if (err instanceof AuthenticationError) {
        setError('Thông tin đăng nhập không chính xác.');
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
      setLoading(false);
    }
  };

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__wrapper`}>
        <h1>Đăng nhập quản trị</h1>
        <p>Sử dụng email/mật khẩu hoặc Google để truy cập hệ thống.</p>

        {error && <Text className="error-message">{error}</Text>}

        <Form onSubmit={onSubmit} className={`${baseClass}__form`}>
          <Email />
          <Password />
          <Button
            type="submit"
            buttonStyle="primary"
            className={`${baseClass}__login-button`}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </Form>

        <div className={`${baseClass}__divider`}>HOẶC</div>

        <Button
          onClick={handleGoogleLogin}
          buttonStyle="secondary"
          className={`${baseClass}__google-button`}
          disabled={loading}
        >
          <span className="icon-google">G</span>
          Đăng nhập với Google
        </Button>
      </div>
    </div>
  );
};

// Helper components
const Email = () => (
  <div className="field-wrapper">
    <label htmlFor="email">Email</label>
    <input
      id="email"
      name="email"
      type="email"
      autoComplete="email"
      required
    />
  </div>
);

const Password = () => (
  <div className="field-wrapper">
    <label htmlFor="password">Mật khẩu</label>
    <input
      id="password"
      name="password"
      type="password"
      autoComplete="current-password"
      required
    />
  </div>
);

export default CustomLogin;
