import type { Metadata, Viewport } from "next";
import ClientRootLayout from "./layout/ClientRootLayout";

const siteUrl = process.env.NODE_ENV === 'production' 
  ? 'https://vinhphat-printing.com' 
  : 'http://localhost:3000';

// Create a basic favicon data URL to prevent Next.js from generating one
const faviconDataUrl = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🖨️</text></svg>';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: faviconDataUrl,
  },
  title: {
    default: "VinhPhat Printing - Dịch vụ in ấn chuyên nghiệp",
    template: "%s | VinhPhat Printing",
  },
  description: "VinhPhat Printing - Chuyên cung cấp các dịch vụ in ấn chất lượng cao với hơn 15 năm kinh nghiệm trong ngành.",
  keywords: ["in ấn", "in offset", "in kỹ thuật số", "in hộp giấy", "in catalogue", "in tờ rơi", "in name card", "in bao bì"],
  authors: [{ name: "VinhPhat Printing" }],
  creator: "VinhPhat Printing",
  publisher: "VinhPhat Printing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "VinhPhat Printing - Dịch vụ in ấn chuyên nghiệp",
    description: "Chuyên cung cấp các dịch vụ in ấn chất lượng cao với hơn 15 năm kinh nghiệm trong ngành.",
    url: siteUrl,
    siteName: "VinhPhat Printing",
    images: [
      {
        url: `${siteUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "VinhPhat Printing",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VinhPhat Printing - Dịch vụ in ấn chuyên nghiệp",
    description: "Chuyên cung cấp các dịch vụ in ấn chất lượng cao với hơn 15 năm kinh nghiệm trong ngành.",
    images: [`${siteUrl}/images/og-image.jpg`],
    creator: "@vinhphatprinting",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientRootLayout>{children}</ClientRootLayout>;
}
