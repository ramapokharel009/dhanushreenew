
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  image TEXT,
  price DECIMAL(10,2),
  availability BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  ingredients TEXT,
  usage_instructions TEXT,
  benefits TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  cover_image TEXT,
  content TEXT NOT NULL,
  summary TEXT,
  tags TEXT[],
  published_date DATE DEFAULT CURRENT_DATE,
  author TEXT DEFAULT 'Dhanushree Industries',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  quote TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  location TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table for dynamic theming
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create about_content table
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  image TEXT,
  order_index INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_info table
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT,
  is_primary BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create public read policies for content tables
CREATE POLICY "Public can read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public can read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public can read published blog posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read featured testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read about content" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Public can read contact info" ON public.contact_info FOR SELECT USING (true);

-- Allow public to insert contact submissions
CREATE POLICY "Public can create contact submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Insert sample data for categories
INSERT INTO public.categories (name, description, image) VALUES
('Natural Cosmetics', 'Organic and natural beauty products crafted with care', 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800'),
('Food Supplements', 'Premium nutritional supplements from natural sources', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800'),
('Hygiene & Sanitation', 'Eco-friendly hygiene and sanitation products', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800'),
('Organic Green Tea', 'Premium organic tea blends from Nepal highlands', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800');

-- Insert sample products
INSERT INTO public.products (name, description, category_id, image, price, is_featured, ingredients, usage_instructions, benefits) VALUES
(
  'Himalayan Glow Face Cream',
  'Nourishing face cream enriched with natural Himalayan herbs and minerals',
  (SELECT id FROM public.categories WHERE name = 'Natural Cosmetics' LIMIT 1),
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600',
  1200.00,
  true,
  'Himalayan herbs, Aloe vera, Shea butter, Vitamin E',
  'Apply gently on clean face twice daily',
  'Deep hydration, Anti-aging, Natural glow'
),
(
  'Organic Turmeric Powder',
  'Pure organic turmeric powder with powerful anti-inflammatory properties',
  (SELECT id FROM public.categories WHERE name = 'Food Supplements' LIMIT 1),
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600',
  800.00,
  true,
  '100% Organic Turmeric (Curcuma longa)',
  'Mix 1 tsp with warm milk or water daily',
  'Anti-inflammatory, Immune support, Digestive health'
),
(
  'Eco Hand Sanitizer',
  'Natural hand sanitizer with essential oils and plant-based alcohol',
  (SELECT id FROM public.categories WHERE name = 'Hygiene & Sanitation' LIMIT 1),
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600',
  450.00,
  false,
  'Plant-based alcohol, Tea tree oil, Aloe vera, Lavender oil',
  'Apply small amount and rub hands thoroughly',
  '99.9% germ protection, Moisturizing, Pleasant fragrance'
),
(
  'Premium Green Tea',
  'High-altitude organic green tea with delicate flavor and aroma',
  (SELECT id FROM public.categories WHERE name = 'Organic Green Tea' LIMIT 1),
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600',
  1500.00,
  true,
  'Organic green tea leaves from Nepal highlands',
  'Steep 1 tsp in hot water for 3-5 minutes',
  'Rich in antioxidants, Metabolism boost, Mental clarity'
);

-- Insert sample testimonials
INSERT INTO public.testimonials (name, quote, rating, location, is_featured) VALUES
('Priya Sharma', 'The Himalayan Glow Face Cream has transformed my skin! It feels so natural and nourishing.', 5, 'Kathmandu', true),
('Rajesh Thapa', 'Best organic turmeric powder I have ever used. The quality is exceptional and authentically Nepali.', 5, 'Pokhara', true),
('Sarah Johnson', 'I love how eco-friendly and effective their products are. Truly sustainable beauty!', 5, 'California, USA', false),
('Meera Patel', 'The green tea has the most amazing flavor. You can taste the purity of the Himalayas.', 5, 'Mumbai, India', true);

-- Insert site color settings
INSERT INTO public.site_settings (key, value, description) VALUES
('colors', '{
  "primary": "#166534",
  "secondary": "#16a34a", 
  "accent": "#22c55e",
  "background": "#f0fdf4",
  "surface": "#ffffff",
  "text_primary": "#0f172a",
  "text_secondary": "#475569",
  "text_muted": "#64748b",
  "border": "#e2e8f0",
  "hero_bg": "#ecfdf5",
  "hero_text": "#064e3b",
  "button_primary": "#16a34a",
  "button_primary_hover": "#15803d",
  "footer_bg": "#052e16",
  "footer_text": "#dcfce7"
}', 'Main color palette for the website');

-- Insert about content
INSERT INTO public.about_content (section, title, content, order_index) VALUES
('story', 'Our Story', 'Founded in the heart of Nepal, Dhanushree Industries was born from a deep respect for nature and traditional wellness practices. We combine ancient Ayurvedic wisdom with modern sustainable practices to create products that nurture both people and planet.', 1),
('mission', 'Our Mission', 'To provide pure, natural, and eco-friendly products that enhance well-being while preserving the pristine beauty of Nepal''s natural heritage for future generations.', 2),
('vision', 'Our Vision', 'To become Nepal''s leading sustainable wellness brand, setting new standards for environmental responsibility and natural product excellence in South Asia.', 3);

-- Insert contact information
INSERT INTO public.contact_info (type, value, label, is_primary) VALUES
('email', 'info@dhanushreeindustries.com', 'General Inquiries', true),
('phone', '+977-1-4567890', 'Main Office', true),
('address', 'Kathmandu, Nepal', 'Head Office', true),
('map_url', 'https://maps.google.com/?q=Kathmandu,Nepal', 'Office Location', false);

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, cover_image, content, summary, tags) VALUES
(
  'The Benefits of Himalayan Herbs in Skincare',
  'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
  'The Himalayas are home to some of the world''s most potent medicinal herbs. In this post, we explore how these ancient botanicals can transform your skincare routine with their natural healing properties...',
  'Discover the power of Himalayan herbs for natural skincare and their traditional uses in modern beauty routines.',
  ARRAY['skincare', 'herbs', 'natural', 'himalaya']
),
(
  'Sustainable Beauty: Why Natural Cosmetics Matter',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800',
  'In today''s world, making conscious choices about beauty products is more important than ever. Learn why switching to natural cosmetics benefits both your skin and the environment...',
  'Explore the importance of sustainable beauty and how natural cosmetics contribute to environmental conservation.',
  ARRAY['sustainability', 'natural cosmetics', 'environment', 'eco-friendly']
);
