
-- Add show_npr_price toggle to site_settings
INSERT INTO site_settings (key, value, description) 
VALUES (
  'show_npr_price',
  'true',
  'Toggle to show/hide NPR price label and prices across the site'
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Add business hours to site_settings
INSERT INTO site_settings (key, value, description) 
VALUES (
  'business_hours',
  '{"monday": "9:00 AM - 6:00 PM", "tuesday": "9:00 AM - 6:00 PM", "wednesday": "9:00 AM - 6:00 PM", "thursday": "9:00 AM - 6:00 PM", "friday": "9:00 AM - 6:00 PM", "saturday": "10:00 AM - 4:00 PM", "sunday": "Closed"}',
  'Business hours displayed on contact page'
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Add logo width configuration to site_settings
INSERT INTO site_settings (key, value, description) 
VALUES (
  'logo_width',
  '120',
  'Logo width in pixels for dynamic resizing'
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Update footer configuration to include useful_links
INSERT INTO site_settings (key, value, description) 
VALUES (
  'footer',
  '{"text": "© 2024 Dhanushree Industries Pvt. Ltd. All rights reserved. | Crafted with nature in mind.", "social_links": {"facebook": "https://facebook.com/dhanushreeindustries", "instagram": "https://instagram.com/dhanushreeindustries", "youtube": "https://youtube.com/@dhanushreeindustries"}, "useful_links": ["Privacy Policy", "Terms of Service", "Shipping Policy", "Return Policy", "FAQ"]}',
  'Footer content including useful links'
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Update header configuration to include logo
INSERT INTO site_settings (key, value, description) 
VALUES (
  'header',
  '{"logo": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=100&h=100&fit=crop&crop=center", "nav_links": ["Home", "Products", "About", "Blog", "Contact"], "social_links": {"facebook": "https://facebook.com/dhanushreeindustries", "instagram": "https://instagram.com/dhanushreeindustries", "youtube": "https://youtube.com/@dhanushreeindustries"}}',
  'Header configuration including logo and navigation'
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Update hero_background to include overlay_opacity
UPDATE site_settings 
SET value = jsonb_set(
  COALESCE(value, '{}'::jsonb),
  '{overlay_opacity}',
  '0.5'::jsonb
)
WHERE key = 'hero_background';

-- If hero_background doesn't exist, create it with default values
INSERT INTO site_settings (key, value, description) 
VALUES (
  'hero_background',
  '{"type": "image", "color": "#166534", "image_url": "https://raw.githubusercontent.com/dhanushreeind/image/refs/heads/main/13.png", "overlay_opacity": 0.5}',
  'Hero section background configuration with overlay'
) ON CONFLICT (key) DO NOTHING;
