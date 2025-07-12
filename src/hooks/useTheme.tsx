import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text_primary: string;
  text_secondary: string;
  text_muted: string;
  border: string;
  hero_bg: string;
  hero_text: string;
  button_primary: string;
  button_primary_hover: string;
  footer_bg: string;
  footer_text: string;
}

const hexToHsl = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const useTheme = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [colors, setColors] = useState<ThemeColors | null>(null);
  const queryClient = useQueryClient();

  const applyTheme = (themeColors: ThemeColors) => {
    const root = document.documentElement;
    
    // Apply theme colors as CSS variables
    root.style.setProperty('--theme-primary', hexToHsl(themeColors.primary));
    root.style.setProperty('--theme-secondary', hexToHsl(themeColors.secondary));
    root.style.setProperty('--theme-accent', hexToHsl(themeColors.accent));
    root.style.setProperty('--theme-background', hexToHsl(themeColors.background));
    root.style.setProperty('--theme-surface', hexToHsl(themeColors.surface));
    root.style.setProperty('--theme-text-primary', hexToHsl(themeColors.text_primary));
    root.style.setProperty('--theme-text-secondary', hexToHsl(themeColors.text_secondary));
    root.style.setProperty('--theme-text-muted', hexToHsl(themeColors.text_muted));
    root.style.setProperty('--theme-border', hexToHsl(themeColors.border));
    root.style.setProperty('--theme-hero-bg', hexToHsl(themeColors.hero_bg));
    root.style.setProperty('--theme-hero-text', hexToHsl(themeColors.hero_text));
    root.style.setProperty('--theme-button-primary', hexToHsl(themeColors.button_primary));
    root.style.setProperty('--theme-button-primary-hover', hexToHsl(themeColors.button_primary_hover));
    root.style.setProperty('--theme-footer-bg', hexToHsl(themeColors.footer_bg));
    root.style.setProperty('--theme-footer-text', hexToHsl(themeColors.footer_text));
  };

  const loadTheme = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'colors')
        .single();

      if (error) {
        console.error('Error loading theme:', error);
        return;
      }

      if (data?.value) {
        // Type assertion with proper validation
        const themeColors = data.value as unknown as ThemeColors;
        setColors(themeColors);
        applyTheme(themeColors);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTheme();

    // Set up real-time subscription for theme changes
    const channel = supabase
      .channel('theme-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings',
          filter: 'key=eq.colors'
        },
        (payload) => {
          console.log('Theme colors updated:', payload);
          if (payload.new?.value) {
            const themeColors = payload.new.value as unknown as ThemeColors;
            setColors(themeColors);
            applyTheme(themeColors);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { colors, isLoading, loadTheme };
};
