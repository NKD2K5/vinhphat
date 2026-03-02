"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LogoImage {
  imageUrl: string;
  alt?: string;
  displayMode?: "auto" | "fixed-width" | "fixed-height" | "fixed-both";
}

interface LogoMobile {
  enabled: boolean;
  imageUrl?: string;
}

interface LogoData {
  logo: LogoImage;
  logoMobile: LogoMobile;
  siteInfo: {
    siteName: string;
    tagline?: string;
  };
}

interface LogoProps {
  className?: string;
  isMobile?: boolean;
  isScrolled?: boolean;
  isDarkBackground?: boolean;
  theme?: "light" | "dark";
  width?: number;
  height?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Desktop size - chỉnh số này để thay đổi kích thước logo desktop
const DESKTOP_SIZE = 100;

// Mobile size - chỉnh số này để thay đổi kích thước logo mobile
const MOBILE_SIZE = 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeInt(value: unknown, fallback: number): number {
  const n = parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function getContainerStyle(
  isMobile: boolean,
  isScrolled: boolean
): React.CSSProperties {
  const size = isMobile ? MOBILE_SIZE : DESKTOP_SIZE;
  const scale = isScrolled ? 0.85 : 1;

  return {
    position: "relative",
    width: `${Math.round(size * scale)}px`,
    height: `${Math.round(size * scale)}px`,
  };
}

function getImageDimensions(
  isMobile: boolean,
  isScrolled: boolean
): { width: number; height: number } {
  const size = isMobile ? MOBILE_SIZE : DESKTOP_SIZE;
  const scale = isScrolled ? 0.85 : 1;

  return {
    width: Math.round(size * scale),
    height: Math.round(size * scale),
  };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function LogoSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex items-center ${className ?? ""}`}>
      <div
        className="animate-pulse bg-gray-200 rounded-full"
        style={{ width: DESKTOP_SIZE, height: DESKTOP_SIZE }}
        aria-hidden
      />
    </div>
  );
}

// ─── Text fallback ────────────────────────────────────────────────────────────

function TextLogo({
  siteName,
  tagline,
  className,
}: {
  siteName: string;
  tagline?: string;
  className?: string;
}) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className ?? ""}`}>
      <div className="flex flex-col">
        <span className="text-xl font-bold leading-tight">{siteName}</span>
        {tagline && <span className="text-sm text-gray-600">{tagline}</span>}
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Logo({
  className = "",
  isMobile = false,
  isScrolled = false,
  isDarkBackground: _isDarkBackground = false,
  theme: _theme,
}: LogoProps) {
  const [logoData, setLogoData] = useState<LogoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const isMounted = useRef(true);

  const fetchLogoData = useCallback(async () => {
    try {
      const res = await fetch("/api/logo", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (isMounted.current && json.success && json.data) {
        setLogoData(json.data);
        setImageError(false);
      }
    } catch (err) {
      console.error("[Logo] fetch error:", err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchLogoData();
    window.addEventListener("logo-updated", fetchLogoData);

    return () => {
      isMounted.current = false;
      window.removeEventListener("logo-updated", fetchLogoData);
    };
  }, [fetchLogoData]);

  if (loading) return <LogoSkeleton className={className} />;

  if (!logoData?.logo?.imageUrl) {
    return <TextLogo siteName="VinhPhat" tagline="Printing" className={className} />;
  }

  const useMobileLogo =
    isMobile && logoData.logoMobile?.enabled && !!logoData.logoMobile?.imageUrl;

  const logoImageUrl = useMobileLogo
    ? logoData.logoMobile.imageUrl || logoData.logo.imageUrl
    : logoData.logo.imageUrl;

  if (!logoImageUrl || imageError) {
    return (
      <TextLogo
        siteName={logoData.siteInfo?.siteName ?? "VinhPhat"}
        tagline={logoData.siteInfo?.tagline}
        className={className}
      />
    );
  }

  const containerStyle = getContainerStyle(isMobile, isScrolled);
  const { width: finalWidth, height: finalHeight } = getImageDimensions(isMobile, isScrolled);

  return (
    <Link
      href="/"
      className={`relative flex items-center ${className}`}
      aria-label={logoData.siteInfo?.siteName ?? "Home"}
    >
      <div style={containerStyle}>
        <Image
          src={logoImageUrl}
          alt={logoData.logo.alt ?? logoData.siteInfo?.siteName ?? "Logo"}
          width={finalWidth}
          height={finalHeight}
          sizes={isMobile ? "20vw" : "10vw"}
          priority
          quality={90}
          className="object-contain w-full h-full"
          onError={() => setImageError(true)}
        />
      </div>
    </Link>
  );
}