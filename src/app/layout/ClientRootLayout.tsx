'use client';

import { Inter } from "next/font/google";
import "../globals.css";
import ClientLayout from "./ClientLayout";
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues
const FloatingContactIcons = dynamic(
  () => import('@/components/FloatingContactIcons/FloatingContactIcons'),
  { ssr: false }
);

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Function to remove bis_skin_checked attribute
const removeBisSkin = () => {
  try {
    // Remove from document element and body
    [document.documentElement, document.body].forEach(el => {
      if (el?.hasAttribute('bis_skin_checked')) {
        el.removeAttribute('bis_skin_checked');
      }
    });

    // Remove from all elements
    const elements = document.querySelectorAll('[bis_skin_checked]');
    elements.forEach(el => el.removeAttribute('bis_skin_checked'));
  } catch (e) {
    console.warn('Error removing bis_skin_checked:', e);
  }
};

export default function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Client-side effect to remove bis_skin_checked
  useEffect(() => {
    // Run immediately
    removeBisSkin();
    
    // Run after a short delay to catch any late additions
    const timeouts = [10, 50, 100, 200, 500, 1000].map(timeout => 
      setTimeout(removeBisSkin, timeout)
    );
    
    // Cleanup function
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientLayout>
            <main className="flex-grow">
              {children}
            </main>
            <FloatingContactIcons />
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
