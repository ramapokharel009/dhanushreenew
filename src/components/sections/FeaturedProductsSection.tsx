
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  is_featured: boolean;
  display_order: number;
  availability: boolean;
}

export const FeaturedProductsSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('display_order')
        .order('created_at')
        .limit(4);

      if (productsData) setFeaturedProducts(productsData);
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-20 bg-theme-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-theme-text-primary mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-theme-text-secondary max-w-3xl mx-auto">
            Discover our most popular natural products, loved by customers worldwide for their exceptional quality and effectiveness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              showCategory={false}
              index={index}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg"
            variant="outline"
            className="border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white"
            asChild
          >
            <Link to="/products">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
