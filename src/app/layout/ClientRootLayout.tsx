'use client';

import { Inter } from "next/font/google";
import "../globals.css";
import ClientLayout from "./ClientLayout";
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

// Import FloatingButtons
import FloatingButtons from '@/components/FloatingButtons';
import FaviconMetadata from './FaviconMetadata';

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
  const pathname = usePathname();

  // Only run on client side
  useEffect(() => {
    setMounted(true);

    if (
      process.env.NODE_ENV === 'development' &&
      typeof window !== 'undefined' &&
      ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
    ) {
      (async () => {
        try {
          // Clear service workers
          if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            await Promise.all(regs.map(r => r.unregister()));
          }

          // Clear all caches
          if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
          }

          // Clear storages
          localStorage.clear();
          sessionStorage.clear();

          // Force reload once to ensure clean state
          if (!window.location.search.includes('nocache=true')) {
            const url = new URL(window.location.href);
            url.searchParams.set('nocache', 'true');
            window.location.replace(url.toString());
          }
        } catch (e) {
          console.warn('Dev cache cleanup error:', e);
        }
      })();
    }
    
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

  // Check if current page should hide floating buttons
  const shouldHideFloatingButtons = mounted && (
    pathname?.startsWith('/san-pham/') || // Product detail pages
    pathname?.startsWith('/admin/') ||   // Admin pages
    pathname?.includes('/preview')       // Preview pages
  );
  
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
        <FaviconMetadata />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ClientLayout>
              <main className="flex-grow" suppressHydrationWarning>
                {children}
              </main>
              {!shouldHideFloatingButtons && <FloatingButtons />}
            </ClientLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
