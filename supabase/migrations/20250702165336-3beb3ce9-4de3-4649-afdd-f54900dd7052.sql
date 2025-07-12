
-- Insert hero section colors configuration into site_settings
INSERT INTO public.site_settings (key, value, description)
VALUES (
  'hero_section_colors',
  '{
    "title_color": "#ffffff",
    "subheadline_color": "#c0c0c0",
    "cta_primary_text_color": "#ffffff",
    "cta_primary_bg_color": "#16a34a",
    "cta_secondary_text_color": "#ffffff",
    "cta_secondary_border_color": "#ffffff",
    "cta_secondary_hover_bg_color": "#ffffff",
    "cta_secondary_hover_text_color": "#1f2937",
    "stat_label_color": "#c0c0c0",
    "stat_number_color": "#22c55e"
  }'::jsonb,
  'Dynamic color configuration for hero section elements'
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now();
