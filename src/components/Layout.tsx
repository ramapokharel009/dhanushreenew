import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useRealtimeSiteSettings } from '@/hooks/useRealtimeSiteSettings';

interface LayoutProps {
  children: ReactNode;
}

interface ContactInfo {
  type: string;
  value: string;
  label?: string;
}

interface HeaderContent {
  logo: string;
  nav_links: string[];
  social_links: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

interface FooterContent {
  text: string;
  social_links: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  useful_links: string[];
}

interface CompanyBranding {
  name: string;
  tagline: string;
}

interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

interface Category {
  id: string;
  name: string;
  display_order: number;
}

export const Layout = ({ children }: LayoutProps) => {
  useScrollToTop();
  useRealtimeSiteSettings(); // Add real-time subscription
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const location = useLocation();

  const { data: headerContent, isLoading: headerLoading } = useQuery({
    queryKey: ['header-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'header')
        .single();
      
      if (error) throw error;
      return data?.value as unknown as HeaderContent;
    }
  });

  const { data: logoWidth } = useQuery({
    queryKey: ['logo-width'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'logo_width')
        .single();
      
      if (error) throw error;
      return data?.value as unknown as string;
    }
  });

  const { data: footerContent } = useQuery({
    queryKey: ['footer-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'footer')
        .single();
      
      if (error) throw error;
      return data?.value as unknown as FooterContent;
    }
  });

  const { data: companyBranding } = useQuery({
    queryKey: ['company-branding'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'company_branding')
        .single();
      
      if (error) throw error;
      return data?.value as unknown as CompanyBranding;
    }
  });

  const { data: socialMediaLinks } = useQuery({
    queryKey: ['social-media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'social_media')
        .single();
      
      if (error) throw error;
      return data?.value as unknown as SocialMediaLinks;
    }
  });

  // Fetch categories for footer
  useEffect(() => {
    const fetchCategories = async () => {
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name, display_order')
        .order('display_order')
        .order('name');

      if (categoriesData) {
        setCategories(categoriesData);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data } = await supabase
        .from('contact_info')
        .select('type, value, label')
        .eq('is_primary', true);
      
      if (data) {
        setContactInfo(data);
      }
    };

    fetchContactInfo();

    // Set up real-time subscription for contact info changes
    const channel = supabase
      .channel('contact-info-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_info'
        },
        (payload) => {
          console.log('Contact info updated:', payload);
          fetchContactInfo();
        }
      )
      .subscribe((status) => {
        console.log('Contact info subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const navigation = headerContent?.nav_links ? 
    headerContent.nav_links.map(name => ({
      name,
      href: name === 'Home' ? '/' : `/${name.toLowerCase()}`
    })) : 
    [
      { name: 'Home', href: '/' },
      { name: 'Products', href: '/products' },
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ];

  const getContactByType = (type: string) => {
    return contactInfo.find(info => info.type === type)?.value || '';
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return Facebook;
      case 'instagram':
        return Instagram;
      case 'linkedin':
        return Linkedin;
      case 'youtube':
        return Youtube;
      default:
        return null;
    }
  };

  const formatUsefulLinkUrl = (linkName: string) => {
    return `/${linkName.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const getCategoryFilterUrl = (categoryName: string) => {
    // Convert category name to URL-friendly format for filtering
    return `/products?category=${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`;
  };

  if (headerLoading) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-background">
      <header className="bg-theme-surface shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2 group">
              {headerContent?.logo ? (
                <img
                  src={headerContent.logo}
                  alt="Company Logo"
                  style={{ width: logoWidth ? `${logoWidth}px` : '120px', height: 'auto' }}
                  className="group-hover:opacity-80 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallbackDiv) {
                      fallbackDiv.classList.remove('hidden');
                    }
                  }}
                />
              ) : null}
              <div className={headerContent?.logo ? 'hidden' : ''}>
                <div className="bg-theme-primary p-2 rounded-lg group-hover:bg-theme-secondary transition-colors">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-theme-text-primary">
                  {companyBranding?.name || 'Dhanushree Industries'}
                </h1>
                <p className="text-xs text-theme-text-muted">
                  {companyBranding?.tagline || 'Natural & Sustainable'}
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'bg-theme-primary text-white'
                      : 'text-theme-text-secondary hover:text-theme-primary hover:bg-theme-hero-bg'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <Button 
                asChild
                className="bg-theme-button-primary hover:bg-theme-button-primary-hover text-white"
              >
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-theme-border animate-fade-in">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'bg-theme-primary text-white'
                        : 'text-theme-text-secondary hover:text-theme-primary hover:bg-theme-hero-bg'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button 
                  asChild
                  className="bg-theme-button-primary hover:bg-theme-button-primary-hover text-white mt-4"
                >
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                    Get in Touch
                  </Link>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-theme-footer-bg text-theme-footer-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {headerContent?.logo ? (
                  <img
                    src={headerContent.logo}
                    alt="Company Logo"
                    style={{ width: '40px', height: 'auto' }}
                    className="opacity-90"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallbackDiv) {
                        fallbackDiv.classList.remove('hidden');
                      }
                    }}
                  />
                ) : null}
                <div className={headerContent?.logo ? 'hidden' : ''}>
                  <div className="bg-theme-secondary p-2 rounded-lg">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-theme-footer-text">
                    {companyBranding?.name || 'Dhanushree Industries'}
                  </h3>
                  <p className="text-xs text-theme-footer-text/80">
                    {companyBranding?.tagline || 'Natural & Sustainable'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-theme-footer-text/80 leading-relaxed">
                Committed to providing pure, natural, and eco-friendly products that enhance well-being while preserving Nepal's natural heritage.
              </p>
              
              {socialMediaLinks && (
                <div className="flex space-x-4 pt-4">
                  {Object.entries(socialMediaLinks).map(([platform, url]) => {
                    if (!url) return null;
                    const IconComponent = getSocialIcon(platform);
                    if (!IconComponent) return null;
                    
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-theme-primary/20 p-2 rounded-full hover:bg-theme-primary hover:text-white transition-colors"
                      >
                        <IconComponent className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-theme-footer-text">Quick Links</h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm text-theme-footer-text/80 hover:text-theme-footer-text transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-theme-footer-text">Categories</h4>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={getCategoryFilterUrl(category.name)}
                      className="text-sm text-theme-footer-text/80 hover:text-theme-footer-text transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-theme-footer-text">Contact Us</h4>
              <div className="space-y-3">
                {getContactByType('email') && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-theme-footer-text/60" />
                    <span className="text-sm text-theme-footer-text/80">{getContactByType('email')}</span>
                  </div>
                )}
                {getContactByType('phone') && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-theme-footer-text/60" />
                    <span className="text-sm text-theme-footer-text/80">{getContactByType('phone')}</span>
                  </div>
                )}
                {getContactByType('address') && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-theme-footer-text/60" />
                    <span className="text-sm text-theme-footer-text/80">{getContactByType('address')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {footerContent?.useful_links && footerContent.useful_links.length > 0 && (
            <div className="border-t border-theme-footer-text/20 mt-8 pt-8">
              <div className="flex flex-wrap justify-center gap-6 mb-4">
                {footerContent.useful_links.map((link) => (
                  <Link
                    key={link}
                    to={formatUsefulLinkUrl(link)}
                    className="text-sm text-theme-footer-text/80 hover:text-theme-footer-text transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-theme-footer-text/20 mt-8 pt-8 text-center">
            <p className="text-sm text-theme-footer-text/60">
              {footerContent?.text || `© 2024 ${companyBranding?.name || 'Dhanushree Industries'} Pvt. Ltd. All rights reserved. | Crafted with nature in mind.`}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
