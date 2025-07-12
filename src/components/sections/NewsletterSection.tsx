
import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterContent {
  heading: string;
  description: string;
  success_message: string;
}

export const NewsletterSection = () => {
  const [newsletterContent, setNewsletterContent] = useState<NewsletterContent | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchNewsletterContent = async () => {
      const { data: newsletterData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'newsletter')
        .single();

      if (newsletterData?.value) setNewsletterContent(newsletterData.value as unknown as NewsletterContent);
    };

    fetchNewsletterContent();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-20 bg-theme-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {newsletterContent?.heading || 'Stay Updated with Natural Living Tips'}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {newsletterContent?.description || 'Subscribe to our newsletter and get the latest updates on natural wellness, sustainable living, and exclusive offers.'}
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3 rounded-full text-theme-text-primary border-0 focus:ring-2 focus:ring-white/50 outline-none"
              required
            />
            <Button 
              type="submit"
              size="lg"
              className="bg-white text-theme-primary hover:bg-white/90 px-8 py-3 rounded-full font-semibold"
            >
              Subscribe
            </Button>
          </form>
          
          <p className="text-white/60 text-sm mt-4">
            <CheckCircle className="inline h-4 w-4 mr-1" />
            No spam, unsubscribe anytime
          </p>
        </div>
      </div>
    </section>
  );
};
