"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface LogoData {
  logo: {
    imageUrl: string
    alt: string
    width: number
    height: number
  }
  logoMobile: {
    enabled: boolean
    imageUrl?: string
    width: number
    height: number
  }
  siteInfo: {
    siteName: string
    tagline: string
  }
}

interface LogoProps {
  className?: string
  isMobile?: boolean
}

export default function Logo({ className = "", isMobile = false }: LogoProps) {
  const [logoData, setLogoData] = useState<LogoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/site-branding")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setLogoData(data.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching logo:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Link href="/" className={`flex items-center gap-2 ${className}`}>
        <div className="bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse rounded-lg h-8 w-20 shadow-sm"></div>
      </Link>
    )
  }

  // Determine which logo to use
  const useMobileLogo = isMobile && logoData?.logoMobile?.enabled && logoData?.logoMobile?.imageUrl
  const logoConfig = useMobileLogo ? logoData?.logoMobile : logoData?.logo
  const logoImageUrl = useMobileLogo ? logoData?.logoMobile?.imageUrl : logoData?.logo?.imageUrl

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 group transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${className}`}
    >
      {logoImageUrl ? (
        <Image
          src={logoImageUrl || "/placeholder.svg"}
          alt={logoData?.logo?.alt || logoData?.siteInfo?.siteName || "Logo"}
          width={logoConfig?.width || 200}
          height={logoConfig?.height || 60}
          className="h-10 w-auto object-contain"
          priority
          unoptimized
        />
      ) : (
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent leading-tight group-hover:from-blue-500 group-hover:via-blue-400 group-hover:to-cyan-400 transition-all duration-300">
            {logoData?.siteInfo?.siteName || "VinhPhat"}
          </span>
          <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase group-hover:text-slate-300 transition-colors duration-300">
            {logoData?.siteInfo?.tagline || "Printing"}
          </span>
        </div>
      )}
    </Link>
  )
}
