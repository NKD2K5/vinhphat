"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LogoImage {
  imageUrl: string;
  imageUrlDark?: string;
  alt?: string;
  displayMode?: "auto" | "fixed-width" | "fixed-height" | "fixed-both";
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
}

interface LogoMobile {
  enabled: boolean;
  imageUrl?: string;
  imageUrlDark?: string;
  width?: number;
  height?: number;
  customWidth?: number;
  customHeight?: number;
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

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 72;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely convert any value to a positive integer, or return fallback */
function safeInt(value: unknown, fallback: number): number {
  const n = parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function getContainerStyle(
  logo: LogoImage,
  mobile: LogoMobile,
  isMobile: boolean,
  overrideWidth?: number,
  overrideHeight?: number
): React.CSSProperties {
  if (isMobile && mobile.enabled) {
    const w = safeInt(overrideWidth ?? (mobile.customWidth ?? mobile.width), DEFAULT_WIDTH);
    const h = safeInt(overrideHeight ?? (mobile.customHeight ?? mobile.height), DEFAULT_HEIGHT);
    return { width: w, height: h, position: "relative" };
  }

  const mode = logo.displayMode ?? "auto";
  const w = safeInt(overrideWidth ?? logo.width, DEFAULT_WIDTH);
  const h = safeInt(overrideHeight ?? logo.height, DEFAULT_HEIGHT);
  const mw = safeInt(overrideWidth ?? logo.maxWidth, DEFAULT_WIDTH);
  const mh = safeInt(overrideHeight ?? logo.maxHeight, DEFAULT_HEIGHT);

  switch (mode) {
    case "fixed-width":
      return { width: w, height: h, position: "relative" };
    case "fixed-height":
      return { width: w, height: h, position: "relative" };
    case "fixed-both":
      return { width: w, height: h, position: "relative" };
    default:
      return {
        position: "relative",
        width: isMobile ? 150 : mw,
        height: mh,
      };
  }
}

function getImageDimensions(
  logo: LogoImage,
  mobile: LogoMobile,
  isMobile: boolean,
  overrideWidth?: number,
  overrideHeight?: number
): { width: number; height: number } {
  if (isMobile && mobile.enabled) {
    return {
      width: safeInt(overrideWidth ?? (mobile.customWidth ?? mobile.width), DEFAULT_WIDTH),
      height: safeInt(overrideHeight ?? (mobile.customHeight ?? mobile.height), DEFAULT_HEIGHT),
    };
  }

  const mode = logo.displayMode ?? "auto";
  const w = safeInt(overrideWidth ?? logo.width, DEFAULT_WIDTH);
  const h = safeInt(overrideHeight ?? logo.height, DEFAULT_HEIGHT);
  const mw = safeInt(overrideWidth ?? logo.maxWidth, DEFAULT_WIDTH);
  const mh = safeInt(overrideHeight ?? logo.maxHeight, DEFAULT_HEIGHT);

  switch (mode) {
    case "fixed-width":
    case "fixed-height":
    case "fixed-both":
      return { width: w, height: h };
    default:
      return { width: isMobile ? 150 : mw, height: mh };
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function LogoSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex items-center ${className ?? ""}`}>
      <div
        className="animate-pulse bg-gray-200 rounded"
        style={{ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT}}
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
  isDarkBackground = false,
  theme,
  width,
  height,
}: LogoProps) {
  const [logoData, setLogoData] = useState<LogoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const isMounted = useRef(true);

  // ── Fetch logo data ──────────────────────────────────────────────────────────
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

  // ── Render: Loading ──────────────────────────────────────────────────────────
  if (loading) return <LogoSkeleton className={className} />;

  // ── Render: No data fallback ─────────────────────────────────────────────────
  if (!logoData?.logo?.imageUrl) {
    return (
      <TextLogo
        siteName="VinhPhat"
        tagline="Printing"
        className={className}
      />
    );
  }

  // ── Resolve image URL ────────────────────────────────────────────────────────
  const useMobileLogo =
    isMobile && logoData.logoMobile?.enabled && !!logoData.logoMobile?.imageUrl;

  const resolvedTheme: "light" | "dark" = theme ?? (isDarkBackground ? "dark" : "light");

  const resolveUrl = (): string => {
    if (useMobileLogo) {
      if (resolvedTheme === "dark") {
        return (
          logoData.logoMobile.imageUrlDark ||
          logoData.logoMobile.imageUrl ||
          logoData.logo.imageUrl
        );
      }
      return (
        logoData.logoMobile.imageUrl ||
        logoData.logo.imageUrl
      );
    }

    if (resolvedTheme === "dark") {
      return logoData.logo.imageUrlDark || logoData.logo.imageUrl;
    }
    return logoData.logo.imageUrl;
  };

  const logoImageUrl = resolveUrl();

  // ── Render: Image error fallback ─────────────────────────────────────────────
  if (!logoImageUrl || imageError) {
    return (
      <TextLogo
        siteName={logoData.siteInfo?.siteName ?? "VinhPhat"}
        tagline={logoData.siteInfo?.tagline}
        className={className}
      />
    );
  }

  const containerStyle = getContainerStyle(
    logoData.logo,
    logoData.logoMobile,
    isMobile,
    width,
    height
  );

  const { width: imageWidth, height: imageHeight } = getImageDimensions(
    logoData.logo,
    logoData.logoMobile,
    isMobile,
    width,
    height
  );

  // ── Render: Image ────────────────────────────────────────────────────────────
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
          width={imageWidth}
          height={imageHeight}
          sizes={`${imageWidth}px`}
          priority
          quality={90}
          className="object-contain"
          onError={() => setImageError(true)}
        />
      </div>
    </Link>
  );
}