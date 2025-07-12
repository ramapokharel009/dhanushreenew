
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: blogPost, isLoading } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      if (!id) throw new Error('No blog post ID provided');
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
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

  if (!blogPost) {
    return (
      <Layout>
        <div className="min-h-screen bg-theme-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-theme-text-primary mb-4">Blog post not found</h1>
            <Link to="/blog">
              <Button className="bg-theme-button-primary hover:bg-theme-button-primary-hover text-white">
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-theme-background">
        <article className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Back Button */}
            <Link to="/blog" className="inline-flex items-center text-theme-text-secondary hover:text-theme-text-primary mb-8 animate-fade-in">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            {/* Article Header */}
            <header className="mb-8 animate-fade-in-up">
              {blogPost.cover_image && (
                <div className="aspect-video overflow-hidden rounded-lg mb-8">
                  <img 
                    src={blogPost.cover_image} 
                    alt={blogPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {blogPost.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-theme-accent/10 text-theme-text-primary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-theme-text-primary mb-4">
                {blogPost.title}
              </h1>

              {blogPost.summary && (
                <p className="text-xl text-theme-text-secondary mb-6">
                  {blogPost.summary}
                </p>
              )}

              <div className="flex items-center justify-between text-theme-text-muted border-b border-theme-border pb-6">
                <span className="font-medium">{blogPost.author}</span>
                <time dateTime={blogPost.published_date!}>
                  {new Date(blogPost.published_date!).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-theme-text-secondary leading-relaxed whitespace-pre-line">
                {blogPost.content}
              </div>
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-theme-border animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-theme-text-primary mb-4">
                  Enjoyed this article?
                </h3>
                <p className="text-theme-text-secondary mb-6">
                  Explore more insights about natural wellness and sustainable living
                </p>
                <Link to="/blog">
                  <Button className="bg-theme-button-primary hover:bg-theme-button-primary-hover text-white">
                    Read More Articles
                  </Button>
                </Link>
              </div>
            </footer>
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default BlogDetail;
