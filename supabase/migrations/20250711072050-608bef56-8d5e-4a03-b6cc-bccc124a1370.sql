
-- Create admin policies for all tables to allow full CRUD operations
-- We'll use a simple approach where any authenticated user can be an admin
-- In production, you'd want proper role-based access control

-- Site Settings policies
CREATE POLICY "Admin can insert site settings" ON public.site_settings
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update site settings" ON public.site_settings
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete site settings" ON public.site_settings
FOR DELETE TO authenticated USING (true);

-- Products policies
CREATE POLICY "Admin can insert products" ON public.products
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update products" ON public.products
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete products" ON public.products
FOR DELETE TO authenticated USING (true);

-- Categories policies
CREATE POLICY "Admin can insert categories" ON public.categories
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update categories" ON public.categories
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete categories" ON public.categories
FOR DELETE TO authenticated USING (true);

-- Blog Posts policies
CREATE POLICY "Admin can insert blog posts" ON public.blog_posts
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update blog posts" ON public.blog_posts
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete blog posts" ON public.blog_posts
FOR DELETE TO authenticated USING (true);

-- Testimonials policies
CREATE POLICY "Admin can insert testimonials" ON public.testimonials
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update testimonials" ON public.testimonials
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete testimonials" ON public.testimonials
FOR DELETE TO authenticated USING (true);

-- Contact Info policies
CREATE POLICY "Admin can insert contact info" ON public.contact_info
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update contact info" ON public.contact_info
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete contact info" ON public.contact_info
FOR DELETE TO authenticated USING (true);

-- About Content policies
CREATE POLICY "Admin can insert about content" ON public.about_content
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admin can update about content" ON public.about_content
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin can delete about content" ON public.about_content
FOR DELETE TO authenticated USING (true);

-- Contact Submissions - allow admin to read all submissions
CREATE POLICY "Admin can read contact submissions" ON public.contact_submissions
FOR SELECT TO authenticated USING (true);
