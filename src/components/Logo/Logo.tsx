'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoData {
  logo: {
    imageUrl: string;
    alt: string;
    width: number;
    height: number;
  };
  logoMobile: {
    enabled: boolean;
    imageUrl?: string;
    width: number;
    height: number;
  };
  siteInfo: {
    siteName: string;
    tagline: string;
  };
}

interface LogoProps {
  className?: string;
  isMobile?: boolean;
}

export default function Logo({ className = '', isMobile = false }: LogoProps) {
  const [logoData, setLogoData] = useState<LogoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site-branding')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setLogoData(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching logo:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Link href="/" className={`flex items-center ${className}`}>
        <div className="bg-gray-200 animate-pulse rounded h-12 w-32"></div>
      </Link>
    );
  }

  // Determine which logo to use
  const useMobileLogo = isMobile && logoData?.logoMobile?.enabled && logoData?.logoMobile?.imageUrl;
  const logoConfig = useMobileLogo ? logoData?.logoMobile : logoData?.logo;
  const logoImageUrl = useMobileLogo ? logoData?.logoMobile?.imageUrl : logoData?.logo?.imageUrl;

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      {logoImageUrl ? (
        <Image
          src={logoImageUrl}
          alt={logoData?.logo?.alt || logoData?.siteInfo?.siteName || 'Logo'}
          width={logoConfig?.width || 180}
          height={logoConfig?.height || 50}
          className="object-contain"
          priority
        />
      ) : (
        // Fallback text logo
        <div className="flex flex-col">
          <span className="text-xl font-bold text-blue-600">
            {logoData?.siteInfo?.siteName || 'VinhPhat'}
          </span>
          <span className="text-xs text-gray-500">
            {logoData?.siteInfo?.tagline || 'Printing'}
          </span>
        </div>
      )}
    </Link>
  );
}
