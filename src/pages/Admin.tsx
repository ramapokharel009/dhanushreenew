
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { SiteSettingsManager } from '@/components/admin/SiteSettingsManager';
import { ProductsManager } from '@/components/admin/ProductsManager';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { BlogPostsManager } from '@/components/admin/BlogPostsManager';
import { TestimonialsManager } from '@/components/admin/TestimonialsManager';
import { ContactInfoManager } from '@/components/admin/ContactInfoManager';
import { ContactSubmissionsManager } from '@/components/admin/ContactSubmissionsManager';
import { AboutContentManager } from '@/components/admin/AboutContentManager';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/site-settings" element={<SiteSettingsManager />} />
        <Route path="/products" element={<ProductsManager />} />
        <Route path="/categories" element={<CategoriesManager />} />
        <Route path="/blog-posts" element={<BlogPostsManager />} />
        <Route path="/testimonials" element={<TestimonialsManager />} />
        <Route path="/contact-info" element={<ContactInfoManager />} />
        <Route path="/contact-submissions" element={<ContactSubmissionsManager />} />
        <Route path="/about-content" element={<AboutContentManager />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
