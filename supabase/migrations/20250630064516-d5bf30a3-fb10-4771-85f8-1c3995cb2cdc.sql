
-- Add hero background configuration to site_settings
INSERT INTO site_settings (key, value, description) 
VALUES (
  'hero_background',
  '{"type": "image", "image_url": "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=800&h=600&fit=crop", "color": "#10b981"}',
  'Hero section background configuration - type can be "image" or "color"'
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Add company branding configuration
INSERT INTO site_settings (key, value, description) 
VALUES (
  'company_branding',
  '{"name": "Dhanushree Industries", "tagline": "Natural & Sustainable"}',
  'Company name and tagline displayed throughout the site'
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Add social media links configuration
INSERT INTO site_settings (key, value, description) 
VALUES (
  'social_media',
  '{"facebook": "https://facebook.com/dhanushreeindustries", "instagram": "https://instagram.com/dhanushreeindustries", "linkedin": "https://linkedin.com/company/dhanushreeindustries", "youtube": "https://youtube.com/@dhanushreeindustries"}',
  'Social media links for footer'
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Add display_order column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add display_order column to categories table  
ALTER TABLE categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing products with sequential display order using a subquery approach
WITH numbered_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM products 
  WHERE display_order = 0
)
UPDATE products 
SET display_order = numbered_products.rn
FROM numbered_products 
WHERE products.id = numbered_products.id;

-- Update existing categories with sequential display order using a subquery approach
WITH numbered_categories AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM categories 
  WHERE display_order = 0
)
UPDATE categories 
SET display_order = numbered_categories.rn
FROM numbered_categories 
WHERE categories.id = numbered_categories.id;

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Create public read-only policies for all tables
-- Products policies
DROP POLICY IF EXISTS "Public read access for products" ON products;
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);

-- Categories policies  
DROP POLICY IF EXISTS "Public read access for categories" ON categories;
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);

-- Site settings policies
DROP POLICY IF EXISTS "Public read access for site_settings" ON site_settings;
CREATE POLICY "Public read access for site_settings" ON site_settings FOR SELECT USING (true);

-- Testimonials policies
DROP POLICY IF EXISTS "Public read access for testimonials" ON testimonials;
CREATE POLICY "Public read access for testimonials" ON testimonials FOR SELECT USING (true);

-- Blog posts policies
DROP POLICY IF EXISTS "Public read access for blog_posts" ON blog_posts;
CREATE POLICY "Public read access for blog_posts" ON blog_posts FOR SELECT USING (true);

-- About content policies
DROP POLICY IF EXISTS "Public read access for about_content" ON about_content;
CREATE POLICY "Public read access for about_content" ON about_content FOR SELECT USING (true);

-- Contact info policies
DROP POLICY IF EXISTS "Public read access for contact_info" ON contact_info;
CREATE POLICY "Public read access for contact_info" ON contact_info FOR SELECT USING (true);
