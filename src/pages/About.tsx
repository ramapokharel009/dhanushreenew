
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';

interface AboutPageContent {
  heading: string;
  subheading: string;
  sections: Array<{
    title: string;
    content: string;
    image?: string;
  }>;
}

// Type for database content that has different structure
interface AboutDatabaseContent {
  id: string;
  section: string;
  title?: string;
  content: string;
  image?: string;
}

const About = () => {
  const { data: aboutPageContent, isLoading: pageLoading } = useQuery({
    queryKey: ['about-page-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'about_page')
        .single();
      
      if (error) throw error;
      return data?.value as unknown as AboutPageContent;
    }
  });

  const { data: aboutContent, isLoading: contentLoading } = useQuery({
    queryKey: ['about-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data as AboutDatabaseContent[];
    }
  });

  if (pageLoading || contentLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-theme-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>
        </div>
      </Layout>
    );
  }

  // Use dynamic content from site_settings, fallback to database content if available
  const sections = aboutPageContent?.sections || aboutContent || [];
  const heading = aboutPageContent?.heading || 'About Dhanushree Industries';
  const subheading = aboutPageContent?.subheading || 'Crafting natural wellness products with love, tradition, and sustainability at heart';

  return (
    <Layout>
      <div className="min-h-screen bg-theme-background">
        {/* Hero Section */}
        <section className="bg-theme-hero-bg py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-theme-hero-text mb-6 animate-fade-in-up">
              {heading}
            </h1>
            <p className="text-xl text-theme-text-secondary max-w-3xl mx-auto animate-fade-in-up">
              {subheading}
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 max-w-4xl mx-auto">
              {sections.map((section, index) => {
                // Handle both data structures safely
                const sectionData = section as AboutDatabaseContent | AboutPageContent['sections'][0];
                const hasId = 'id' in sectionData;
                const hasSection = 'section' in sectionData;
                
                return (
                  <Card key={hasId ? sectionData.id : index} className="border-theme-border bg-theme-surface shadow-lg animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-8">
                      <h2 className="text-3xl font-bold text-theme-text-primary mb-6">
                        {sectionData.title || (hasSection ? (sectionData as AboutDatabaseContent).section : '')}
                      </h2>
                      <p className="text-lg text-theme-text-secondary leading-relaxed">
                        {sectionData.content}
                      </p>
                      {sectionData.image && (
                        <div className="mt-6">
                          <img 
                            src={sectionData.image} 
                            alt={sectionData.title || (hasSection ? (sectionData as AboutDatabaseContent).section : 'About section')}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-theme-hero-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-theme-hero-text mb-4">Our Values</h2>
              <p className="text-theme-text-secondary max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "Sustainability",
                  description: "Every product is created with respect for our planet and future generations",
                  icon: "🌱"
                },
                {
                  title: "Purity",
                  description: "We use only the finest natural ingredients, free from harmful chemicals",
                  icon: "✨"
                },
                {
                  title: "Tradition",
                  description: "Ancient Ayurvedic wisdom meets modern sustainable practices",
                  icon: "🕉️"
                }
              ].map((value, index) => (
                <Card key={index} className="border-theme-border bg-theme-surface text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold text-theme-text-primary mb-3">
                      {value.title}
                    </h3>
                    <p className="text-theme-text-secondary">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
