
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FolderTree, FileText, MessageSquare, Phone, Mail, Info, Settings } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: productsCount },
        { count: categoriesCount },
        { count: blogPostsCount },
        { count: testimonialsCount },
        { count: contactInfoCount },
        { count: contactSubmissionsCount },
        { count: aboutContentCount },
        { count: siteSettingsCount }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('contact_info').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('about_content').select('*', { count: 'exact', head: true }),
        supabase.from('site_settings').select('*', { count: 'exact', head: true })
      ]);

      return {
        products: productsCount || 0,
        categories: categoriesCount || 0,
        blogPosts: blogPostsCount || 0,
        testimonials: testimonialsCount || 0,
        contactInfo: contactInfoCount || 0,
        contactSubmissions: contactSubmissionsCount || 0,
        aboutContent: aboutContentCount || 0,
        siteSettings: siteSettingsCount || 0
      };
    }
  });

  const statCards = [
    { title: 'Products', value: stats?.products || 0, icon: Package, color: 'text-blue-600' },
    { title: 'Categories', value: stats?.categories || 0, icon: FolderTree, color: 'text-green-600' },
    { title: 'Blog Posts', value: stats?.blogPosts || 0, icon: FileText, color: 'text-purple-600' },
    { title: 'Testimonials', value: stats?.testimonials || 0, icon: MessageSquare, color: 'text-orange-600' },
    { title: 'Contact Info', value: stats?.contactInfo || 0, icon: Phone, color: 'text-red-600' },
    { title: 'Contact Submissions', value: stats?.contactSubmissions || 0, icon: Mail, color: 'text-pink-600' },
    { title: 'About Content', value: stats?.aboutContent || 0, icon: Info, color: 'text-cyan-600' },
    { title: 'Site Settings', value: stats?.siteSettings || 0, icon: Settings, color: 'text-indigo-600' }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-theme-text-primary">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-theme-hero-bg rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-theme-text-primary">Dashboard</h1>
        <p className="text-theme-text-muted">Overview of your website content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-theme-text-secondary">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-theme-text-primary">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-theme-hero-bg rounded-lg">
              <h3 className="font-semibold text-theme-text-primary mb-2">Content Management</h3>
              <p className="text-sm text-theme-text-muted">
                Manage products, categories, and blog posts to keep your site content fresh and engaging.
              </p>
            </div>
            <div className="p-4 bg-theme-hero-bg rounded-lg">
              <h3 className="font-semibold text-theme-text-primary mb-2">Site Settings</h3>
              <p className="text-sm text-theme-text-muted">
                Customize your site appearance, contact information, and other global settings.
              </p>
            </div>
            <div className="p-4 bg-theme-hero-bg rounded-lg">
              <h3 className="font-semibold text-theme-text-primary mb-2">Customer Engagement</h3>
              <p className="text-sm text-theme-text-muted">
                Review contact submissions and manage testimonials to build trust with your audience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
