'use client';

import { useState, useEffect } from 'react';

type ButtonConfig = {
  type: 'phone' | 'messenger' | 'zalo' | 'gmail' | 'website' | 'whatsapp';
  label: string;
  url: string;
  backgroundColor?: string;
  enabled: boolean;
};

type FloatingButtonsData = {
  enabled: boolean;
  buttons: ButtonConfig[];
};

export function useFloatingButtons() {
  const [data, setData] = useState<FloatingButtonsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/floating-buttons');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if response has content
        const text = await response.text();
        if (!text) {
          throw new Error('Empty response from server');
        }
        
        // Try to parse JSON
        let json;
        try {
          json = JSON.parse(text);
          console.log('Raw API response:', json);
          
          // Check if the response has the expected data structure
          if (json && json.data) {
            // Only extract the fields we need
            const data = json.data;
            console.log('CMS data:', data);
            
            const cleanedData = {
              enabled: data.enabled !== false,
              buttons: Array.isArray(data.buttons) ? data.buttons.filter((btn: any) => {
                const isValid = btn && btn.type && btn.url;
                console.log('Button validation:', btn, 'isValid:', isValid);
                return isValid;
              }) : [],
            };
            console.log('Cleaned data:', cleanedData);
            setData(cleanedData);
          } else {
            throw new Error('Invalid data structure in response');
          }
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          throw new Error('Invalid JSON response from server');
        }
      } catch (err) {
        console.error('Lỗi khi tải cấu hình nút liên hệ:', err);
        const error = err instanceof Error ? err : new Error('Có lỗi xảy ra');
        console.error('Error loading floating buttons:', error);
        setError(error);
        
        // Fallback data in case of error
        const fallbackData = {
          enabled: true,
          buttons: [
            {
              type: 'phone',
              label: 'Gọi ngay',
              url: 'tel:0977344567',
              backgroundColor: '#25D366',
              enabled: true,
            },
            {
              type: 'zalo',
              label: 'Zalo',
              url: 'https://zalo.me/0977344567',
              backgroundColor: '#0068FF',
              enabled: true,
            },
            {
              type: 'messenger',
              label: 'Messenger',
              url: 'https://m.me/vinhphatprinting',
              backgroundColor: '#0084FF',
              enabled: true,
            },
            {
              type: 'gmail',
              label: 'Gmail',
              url: 'mailto:invinhphat6868@gmail.com',
              backgroundColor: '#EA4335',
              enabled: true,
            },
          ],
        };
        
        console.warn('Using fallback data for floating buttons');
        setData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}
