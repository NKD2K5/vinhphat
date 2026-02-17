"use client";

import { useCallback } from 'react';

export function useLogoUpdate() {
  const triggerLogoUpdate = useCallback(() => {
    // Dispatch custom event to notify all Logo components
    window.dispatchEvent(new CustomEvent('logo-updated'));
  }, []);

  const updateLogoSettings = useCallback(async (settings: {
    alt?: string;
    displayMode?: string;
    width?: number;
    height?: number;
    maxWidth?: number;
    maxHeight?: number;
  }) => {
    try {
      const response = await fetch('/api/logo', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      
      if (data.success) {
        // Trigger update event
        triggerLogoUpdate();
        console.log('Logo settings updated successfully');
      } else {
        console.error('Failed to update logo settings:', data.error);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating logo settings:', error);
      throw error;
    }
  }, [triggerLogoUpdate]);

  return {
    triggerLogoUpdate,
    updateLogoSettings,
  };
}
