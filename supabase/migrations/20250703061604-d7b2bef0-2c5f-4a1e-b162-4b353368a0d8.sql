
-- Insert hero section height percentage configuration into site_settings
INSERT INTO public.site_settings (key, value, description)
VALUES (
  'hero_section_height_percentage',
  '{
    "desktop": 80,
    "mobile": 60
  }'::jsonb,
  'Dynamic height configuration for hero section as percentage of viewport height (30-100vh allowed)'
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now();
