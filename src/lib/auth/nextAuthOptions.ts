import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!user?.email) return false;

        const response = await fetch(`${PAYLOAD_URL}/oauth-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: (user as any).image,
            googleId: account?.providerAccountId,
          }),
        });

        if (!response.ok) {
          console.error('OAuth login to Payload failed', await response.text());
          return false;
        }

        const data = await response.json();

        if (!data?.success || !data?.token) {
          console.error('Invalid response from Payload /oauth-login', data);
          return false;
        }

        // Lưu token vào user object để redirect callback có thể truy cập
        (user as any).payloadToken = data.token;

        return true;
      } catch (error) {
        console.error('Error in NextAuth signIn callback:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.payloadToken = (user as any).payloadToken;
        token.payloadUserId = (user as any).payloadUserId;
        token.payloadRole = (user as any).payloadRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.payloadUserId as string | undefined;
        (session as any).payloadToken = token.payloadToken;
        (session as any).payloadRole = token.payloadRole;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/auth/callback')) return url;
      // Sau khi login thành công, redirect về callback handler với token
      return `${baseUrl}/auth/callback`;
    },
  },
  pages: {
    signIn: '/login',
    // Sẽ dùng callback tùy chỉnh
  },
  secret: process.env.NEXTAUTH_SECRET,
};
