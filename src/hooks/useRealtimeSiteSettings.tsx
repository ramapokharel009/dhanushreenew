
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSiteSettings = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up real-time subscription for site_settings');
    
    const channel = supabase
      .channel('site-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'site_settings'
        },
        (payload) => {
          console.log('Site settings changed:', payload);
          
          // Invalidate all queries that depend on site_settings
          queryClient.invalidateQueries({ queryKey: ['site-settings'] });
          queryClient.invalidateQueries({ queryKey: ['header-content'] });
          queryClient.invalidateQueries({ queryKey: ['footer-content'] });
          queryClient.invalidateQueries({ queryKey: ['company-branding'] });
          queryClient.invalidateQueries({ queryKey: ['social-media'] });
          queryClient.invalidateQueries({ queryKey: ['logo-width'] });
          
          // Also invalidate theme-related queries
          queryClient.invalidateQueries({ queryKey: ['theme-colors'] });
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription for site_settings');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
