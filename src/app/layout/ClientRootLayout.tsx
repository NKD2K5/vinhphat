'use client';

import { Inter } from "next/font/google";
import "../globals.css";
import ClientLayout from "./ClientLayout";
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import FloatingButtons
import FloatingButtons from '@/components/FloatingButtons';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  // Only run on client side
  useEffect(() => {
    setMounted(true);
    
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
    
    // Run immediately
    removeBisSkin();
    
    // MutationObserver to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          removeBisSkin();
        }
      });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['bis_skin_checked']
    });
    
    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Don't render anything until we're on the client side
  if (!mounted) {
    return (
      <html lang="vi" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans`} suppressHydrationWarning />
      </html>
    );
  }

  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientLayout>
            <main className="flex-grow" suppressHydrationWarning>
              {children}
            </main>
            <FloatingButtons />
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
