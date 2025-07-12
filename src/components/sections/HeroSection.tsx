
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSiteSettings } from '@/hooks/useRealtimeSiteSettings';

interface HomepageHero {
  title: string;
  subtitle: string;
  cta_text: string;
  background_image: string;
}

interface HeroBackground {
  type: 'image' | 'color';
  image_url?: string;
  color?: string;
  overlay_opacity?: number;
}

interface HeroSectionColors {
  title_color: string;
  subheadline_color: string;
  cta_primary_text_color: string;
  cta_primary_bg_color: string;
  cta_secondary_text_color: string;
  cta_secondary_border_color: string;
  cta_secondary_hover_bg_color: string;
  cta_secondary_hover_text_color: string;
  stat_label_color: string;
  stat_number_color: string;
}

interface HeroHeightSettings {
  desktop: number;
  mobile: number;
}

export const HeroSection = () => {
  useRealtimeSiteSettings(); // Add real-time subscription
  
  const [homepageHero, setHomepageHero] = useState<HomepageHero | null>(null);
  const [heroBackground, setHeroBackground] = useState<HeroBackground | null>(null);
  const [heroColors, setHeroColors] = useState<HeroSectionColors | null>(null);
  const [heroHeightSettings, setHeroHeightSettings] = useState<HeroHeightSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Default colors fallback
  const defaultColors: HeroSectionColors = {
    title_color: "#ffffff",
    subheadline_color: "#c0c0c0",
    cta_primary_text_color: "#ffffff",
    cta_primary_bg_color: "#16a34a",
    cta_secondary_text_color: "#ffffff",
    cta_secondary_border_color: "#ffffff",
    cta_secondary_hover_bg_color: "#ffffff",
    cta_secondary_hover_text_color: "#1f2937",
    stat_label_color: "#c0c0c0",
    stat_number_color: "#22c55e"
  };

  const colors = heroColors || defaultColors;

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchHeroData = async () => {
    try {
      const [heroDataResponse, heroBackgroundResponse, heroColorsResponse, heroHeightResponse] = await Promise.all([
        supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'homepage_hero')
          .single(),
        supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_background')
          .single(),
        supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_section_colors')
          .single(),
        supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_section_height_percentage')
          .single()
      ]);

      if (heroDataResponse.data?.value) {
        setHomepageHero(heroDataResponse.data.value as unknown as HomepageHero);
      }
      if (heroBackgroundResponse.data?.value) {
        setHeroBackground(heroBackgroundResponse.data.value as unknown as HeroBackground);
      }
      if (heroColorsResponse.data?.value) {
        setHeroColors(heroColorsResponse.data.value as unknown as HeroSectionColors);
      }
      if (heroHeightResponse.data?.value) {
        setHeroHeightSettings(heroHeightResponse.data.value as unknown as HeroHeightSettings);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();

    // Set up real-time subscription for hero-specific changes
    const channel = supabase
      .channel('hero-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings',
          filter: 'key=in.(homepage_hero,hero_background,hero_section_colors,hero_section_height_percentage)'
        },
        (payload) => {
          console.log('Hero data updated:', payload);
          // Refetch all hero data when any hero setting changes
          fetchHeroData();
        }
      )
      .subscribe((status) => {
        console.log('Hero subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getHeroBackgroundStyle = () => {
    if (!heroBackground) return {};
    
    if (heroBackground.type === 'color' && heroBackground.color) {
      return { backgroundColor: heroBackground.color };
    } else if (heroBackground.type === 'image' && heroBackground.image_url) {
      return {
        backgroundImage: `url(${heroBackground.image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    return {};
  };

  const getOverlayStyle = () => {
    if (!heroBackground || heroBackground.type !== 'image' || !heroBackground.color) {
      return {};
    }

    const opacity = heroBackground.overlay_opacity ?? 0.5;
    return {
      backgroundColor: heroBackground.color,
      opacity: opacity
    };
  };

  const getHeroSectionStyle = () => {
    const desktopHeight = heroHeightSettings?.desktop || 100;
    const mobileHeight = heroHeightSettings?.mobile || 100;
    
    return {
      minHeight: `${isMobile ? mobileHeight : desktopHeight}vh`,
      ...getHeroBackgroundStyle()
    };
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <section className="relative bg-theme-hero-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-32" />
              </div>
              <div className="grid grid-cols-3 gap-8 pt-8">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
            <div className="relative">
              <Skeleton className="rounded-3xl w-full h-80 lg:h-96" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative bg-theme-hero-bg overflow-hidden flex items-center"
      style={getHeroSectionStyle()}
    >
      {/* Dynamic Overlay for Image Background */}
      {heroBackground?.type === 'image' && heroBackground.color && (
        <div 
          className="absolute inset-0"
          style={getOverlayStyle()}
        />
      )}
      
      {/* Default Gradient Overlay (only when not using dynamic overlay) */}
      {!(heroBackground?.type === 'image' && heroBackground.color) && (
        <div className="absolute inset-0 bg-gradient-to-br from-theme-hero-bg/90 to-theme-background/90"></div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 
                className="text-4xl lg:text-6xl font-bold leading-tight"
                style={{ color: colors.title_color }}
              >
                {homepageHero?.title || 'Pure Nature, Sustainable Future'}
              </h1>
              <p 
                className="text-xl leading-relaxed max-w-2xl"
                style={{ color: colors.subheadline_color }}
              >
                {homepageHero?.subtitle || 'Discover the power of Nepal\'s natural heritage through our premium collection of organic cosmetics, supplements, and eco-friendly products crafted with traditional wisdom.'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg"
                className="text-lg px-8 py-4 rounded-full group transition-colors"
                style={{ 
                  backgroundColor: colors.cta_primary_bg_color,
                  color: colors.cta_primary_text_color
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.cta_primary_bg_color + 'dd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.cta_primary_bg_color;
                }}
              >
                <Link to="/products">
                  {homepageHero?.cta_text || 'Explore Products'}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                variant="outline"
                size="lg"
                asChild
                className="text-lg px-8 py-4 rounded-full transition-colors"
                style={{ 
                  borderColor: colors.cta_secondary_border_color,
                  color: colors.cta_secondary_text_color,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.cta_secondary_hover_bg_color;
                  e.currentTarget.style.color = colors.cta_secondary_hover_text_color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.cta_secondary_text_color;
                }}
              >
                <Link to="/about">Our Story</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div 
                  className="text-3xl font-bold"
                  style={{ color: colors.stat_number_color }}
                >
                  100%
                </div>
                <div 
                  className="text-sm"
                  style={{ color: colors.stat_label_color }}
                >
                  Natural
                </div>
              </div>
              <div className="text-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div 
                  className="text-3xl font-bold"
                  style={{ color: colors.stat_number_color }}
                >
                  5+
                </div>
                <div 
                  className="text-sm"
                  style={{ color: colors.stat_label_color }}
                >
                  Years Experience
                </div>
              </div>
              <div className="text-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <div 
                  className="text-3xl font-bold"
                  style={{ color: colors.stat_number_color }}
                >
                  1000+
                </div>
                <div 
                  className="text-sm"
                  style={{ color: colors.stat_label_color }}
                >
                  Happy Customers
                </div>
              </div>
            </div>
          </div>

          {/* Image container with overlapping effect */}
          <div className="relative animate-slide-in-right lg:flex lg:items-center lg:justify-center">
            {/* Container for the image with controlled overlap */}
            <div className="relative w-full max-w-lg mx-auto lg:mx-0">
              {/* Main image container positioned to create overlap effect */}
              <div className="relative transform lg:translate-y-8">
                <div className="relative z-10">
                  <img
                    src={homepageHero?.background_image || "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=800&h=600&fit=crop"}
                    alt="Natural Products"
                    className="rounded-3xl shadow-2xl w-full h-80 lg:h-96 object-cover"
                  />
                  {/* Eco-Certified badge positioned relative to image */}
                  <div className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-theme-surface p-4 lg:p-6 rounded-2xl shadow-xl animate-bounce-gentle z-20">
                    <div className="flex items-center space-x-3">
                      <div className="bg-theme-primary p-2 rounded-full">
                        <Leaf className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-theme-text-primary text-sm lg:text-base">Eco-Certified</div>
                        <div className="text-xs lg:text-sm text-theme-text-muted">100% Sustainable</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Background decorative elements */}
                <div className="absolute -top-4 -right-4 lg:-top-8 lg:-right-8 w-48 h-48 lg:w-64 lg:h-64 bg-theme-accent/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute -bottom-4 -left-4 lg:-bottom-8 lg:-left-8 w-32 h-32 lg:w-48 lg:h-48 bg-theme-secondary/20 rounded-full blur-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
