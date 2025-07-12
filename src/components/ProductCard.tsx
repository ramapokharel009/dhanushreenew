
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ContactModal } from '@/components/ContactModal';
import { useContactModal } from '@/hooks/useContactModal';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    availability?: boolean;
    is_featured?: boolean;
    categories?: {
      name: string;
    };
  };
  showCategory?: boolean;
  index?: number;
}

export const ProductCard = ({ product, showCategory = true, index = 0 }: ProductCardProps) => {
  const [showNprPrice, setShowNprPrice] = useState(false);
  const { isOpen, contactData, openModal, closeModal } = useContactModal();

  useEffect(() => {
    const fetchPriceToggle = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'show_npr_price')
          .single();
        
        if (data?.value) {
          // Handle both string and boolean values from Supabase
          const value = data.value;
          setShowNprPrice(value === 'true' || value === true);
        } else {
          setShowNprPrice(false);
        }
      } catch (error) {
        console.log('Error fetching price toggle:', error);
        setShowNprPrice(false);
      }
    };

    fetchPriceToggle();

    // Set up real-time subscription to listen for price toggle changes
    const subscription = supabase
      .channel('price-toggle-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings',
          filter: `key=eq.show_npr_price`
        },
        (payload) => {
          console.log('Price toggle updated:', payload);
          if (payload.new?.value) {
            const value = payload.new.value;
            setShowNprPrice(value === 'true' || value === true);
          }
        }
      )
      .subscribe((status) => {
        console.log('Price toggle subscription status:', status);
      });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleContactToBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openModal({ productName: product.name, productId: product.id });
  };

  return (
    <>
      <Card 
        className="group cursor-pointer border-theme-border hover:border-theme-primary transition-all duration-300 hover:shadow-xl animate-fade-in-up h-full flex flex-col"
        style={{animationDelay: `${index * 0.1}s`}}
      >
        <CardContent className="p-0 flex flex-col h-full">
          <Link to={`/products/${product.id}`} className="flex flex-col h-full">
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=400&h=300&fit=crop';
                }}
              />
              {product.is_featured && (
                <div className="absolute top-4 left-4 bg-theme-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </div>
              )}
              {showCategory && product.categories && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-theme-text-primary">
                    {product.categories.name}
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-theme-text-primary mb-2 group-hover:text-theme-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-theme-text-muted mb-4 text-sm leading-relaxed line-clamp-2 flex-grow">
                {product.description}
              </p>
              
              {/* Fixed bottom section for uniform alignment */}
              <div className="mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {showNprPrice && product.price && (
                      <span className="text-2xl font-bold text-theme-primary">
                        NPR {product.price?.toLocaleString()}
                      </span>
                    )}
                    {typeof product.availability !== 'undefined' && (
                      <span className="text-xs text-theme-text-muted">
                        {product.availability ? 'In Stock' : 'Out of Stock'}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm"
                      className="bg-theme-button-primary hover:bg-theme-button-primary-hover text-white"
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white"
                      onClick={handleContactToBuy}
                    >
                      Contact to Buy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>

      <ContactModal
        isOpen={isOpen}
        onClose={closeModal}
        productName={contactData.productName}
        productId={contactData.productId}
      />
    </>
  );
};
