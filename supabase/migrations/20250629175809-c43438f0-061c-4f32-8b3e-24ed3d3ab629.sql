
-- Insert comprehensive site settings for dynamic content management
INSERT INTO public.site_settings (key, value, description) VALUES

-- Homepage Hero Section
('homepage_hero', '{
  "title": "Pure Nature, Sustainable Future",
  "subtitle": "Discover the power of Nepal''s natural heritage through our premium collection of organic cosmetics, supplements, and eco-friendly products crafted with traditional wisdom.",
  "cta_text": "Explore Products",
  "background_image": "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=800&h=600&fit=crop"
}', 'Homepage hero section content including main title, subtitle, call-to-action text, and background image'),

-- Header Configuration
('header', '{
  "logo": "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=100&h=100&fit=crop",
  "nav_links": ["Home", "Products", "About", "Blog", "Contact"],
  "social_links": {
    "facebook": "https://facebook.com/dhanushreeindustries",
    "instagram": "https://instagram.com/dhanushreeindustries",
    "youtube": "https://youtube.com/@dhanushreeindustries"
  }
}', 'Header configuration including logo, navigation links, and social media links'),

-- Footer Configuration
('footer', '{
  "text": "© 2024 Dhanushree Industries Pvt. Ltd. All rights reserved. | Crafted with nature in mind.",
  "social_links": {
    "facebook": "https://facebook.com/dhanushreeindustries",
    "instagram": "https://instagram.com/dhanushreeindustries",
    "youtube": "https://youtube.com/@dhanushreeindustries"
  },
  "useful_links": ["Privacy Policy", "Terms of Use", "Shipping Policy", "Return Policy"]
}', 'Footer content including copyright text, social media links, and useful page links'),

-- Newsletter Section
('newsletter', '{
  "heading": "Stay Updated with Natural Living Tips",
  "description": "Subscribe to our newsletter and get the latest updates on natural wellness, sustainable living, and exclusive offers.",
  "success_message": "Thank you for subscribing! You''ll receive our latest updates on natural wellness and exclusive offers."
}', 'Newsletter signup section content including heading, description, and success message'),

-- Products Page Configuration
('products_page', '{
  "title": "Our Natural Products",
  "description": "Discover our complete range of natural, organic, and eco-friendly products crafted with care for your well-being and the environment.",
  "empty_state_message": "No products available at the moment. Please check back soon for our latest natural wellness products!"
}', 'Products page content including main title, description, and empty state message'),

-- About Page Configuration
('about_page', '{
  "heading": "About Dhanushree Industries",
  "subheading": "Crafting natural wellness products with love, tradition, and sustainability at heart",
  "sections": [
    {
      "title": "Our Story",
      "content": "Founded in the heart of Nepal, Dhanushree Industries was born from a deep respect for nature and traditional wellness practices. We combine ancient Ayurvedic wisdom with modern sustainable practices to create products that nurture both people and planet.",
      "image": "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop"
    },
    {
      "title": "Our Mission",
      "content": "To provide pure, natural, and eco-friendly products that enhance well-being while preserving the pristine beauty of Nepal''s natural heritage for future generations.",
      "image": ""
    },
    {
      "title": "Our Vision",
      "content": "To become Nepal''s leading sustainable wellness brand, setting new standards for environmental responsibility and natural product excellence in South Asia.",
      "image": ""
    }
  ]
}', 'About page content including main heading, subheading, and structured sections with titles, content, and optional images'),

-- Blog Page Configuration
('blog_page', '{
  "title": "Our Blog",
  "intro_text": "Discover insights about natural wellness, sustainable living, and the power of Himalayan herbs",
  "empty_state_message": "No blog posts yet. Stay tuned for exciting content about natural wellness and sustainability!"
}', 'Blog page content including main title, intro text, and empty state message'),

-- Contact Page Configuration
('contact_page', '{
  "title": "Get in Touch",
  "description": "We''d love to hear from you. Send us a message and we''ll respond as soon as possible.",
  "form_fields": ["Name", "Email", "Phone", "Subject", "Message"],
  "success_message": "Message sent successfully! We''ll get back to you soon.",
  "map_url": "https://maps.google.com/?q=Kathmandu,Nepal",
  "contact_details": {
    "email": "info@dhanushreeindustries.com",
    "phone": "+977-1-4567890",
    "address": "Kathmandu, Nepal"
  }
}', 'Contact page content including title, description, form field labels, success message, map URL, and contact details');
