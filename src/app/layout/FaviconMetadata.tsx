"use client";

import { useEffect, useState } from 'react';

interface FaviconData {
  faviconUrl?: string;
  appleTouchIconUrl?: string;
  favicon192?: string;
  favicon512?: string;
}

export default function FaviconMetadata() {
  const [faviconData, setFaviconData] = useState<FaviconData>({});

  useEffect(() => {
    fetch("/api/logo")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.favicon) {
          setFaviconData(data.data.favicon);
        }
      })
      .catch((err) => {
        console.error("Error fetching favicon data:", err);
      });
  }, []);

  useEffect(() => {
    // Update favicon dynamically
    if (faviconData.faviconUrl) {
      // Update main favicon
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || 
                   document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = faviconData.faviconUrl;
      if (!document.querySelector("link[rel*='icon']")) {
        document.getElementsByTagName("head")[0].appendChild(link);
      }

      // Update apple touch icon
      if (faviconData.appleTouchIconUrl) {
        const appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement ||
                         document.createElement("link");
        appleLink.rel = "apple-touch-icon";
        appleLink.href = faviconData.appleTouchIconUrl;
        if (!document.querySelector("link[rel='apple-touch-icon']")) {
          document.getElementsByTagName("head")[0].appendChild(appleLink);
        }
      }

      // Update 192x192 favicon
      if (faviconData.favicon192) {
        const icon192 = document.querySelector("link[rel='icon'][sizes='192x192']") as HTMLLinkElement ||
                       document.createElement("link");
        icon192.rel = "icon";
        icon192.setAttribute("sizes", "192x192");
        icon192.href = faviconData.favicon192;
        if (!document.querySelector("link[rel='icon'][sizes='192x192']")) {
          document.getElementsByTagName("head")[0].appendChild(icon192);
        }
      }

      // Update 512x512 favicon
      if (faviconData.favicon512) {
        const icon512 = document.querySelector("link[rel='icon'][sizes='512x512']") as HTMLLinkElement ||
                       document.createElement("link");
        icon512.rel = "icon";
        icon512.setAttribute("sizes", "512x512");
        icon512.href = faviconData.favicon512;
        if (!document.querySelector("link[rel='icon'][sizes='512x512']")) {
          document.getElementsByTagName("head")[0].appendChild(icon512);
        }
      }
    }
  }, [faviconData]);

  return null; // This component doesn't render anything visible
}
