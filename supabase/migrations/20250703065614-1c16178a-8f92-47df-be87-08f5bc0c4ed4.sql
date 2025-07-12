
-- Enable replica identity for site_settings to capture complete row data during updates
ALTER TABLE public.site_settings REPLICA IDENTITY FULL;

-- Add the site_settings table to the supabase_realtime publication to activate real-time functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
