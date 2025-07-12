
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogPageContent {
  title: string;
  intro_text: string;
  empty_state_message: string;
}

const Blog = () => {
  const { data: blogPageContent } = useQuery({
    queryKey: ['blog-page-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'blog_page')
        .single();
      
      if (error) throw error;
      return data?.value as unknown as BlogPageContent;
    }
  });

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-theme-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-theme-background">
        {/* Hero Section */}
        <section className="bg-theme-hero-bg py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-theme-hero-text mb-6 animate-fade-in-up">
              {blogPageContent?.title || 'Our Blog'}
            </h1>
            <p className="text-xl text-theme-text-secondary max-w-3xl mx-auto animate-fade-in-up">
              {blogPageContent?.intro_text || 'Discover insights about natural wellness, sustainable living, and the power of Himalayan herbs'}
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts?.map((post, index) => (
                <Card key={post.id} className="border-theme-border bg-theme-surface hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Link to={`/blog/${post.id}`} className="block">
                    {post.cover_image && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={post.cover_image} 
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags?.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs bg-theme-accent/10 text-theme-text-primary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="text-xl font-semibold text-theme-text-primary mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      {post.summary && (
                        <p className="text-theme-text-secondary mb-4 line-clamp-3">
                          {post.summary}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-theme-text-muted">
                        <span>{post.author}</span>
                        <span>{new Date(post.published_date!).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            {(!blogPosts || blogPosts.length === 0) && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-theme-text-primary mb-4">
                  No blog posts yet
                </h3>
                <p className="text-theme-text-secondary">
                  {blogPageContent?.empty_state_message || 'Stay tuned for exciting content about natural wellness and sustainability!'}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Blog;
