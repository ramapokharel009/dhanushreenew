
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  display_order: number;
}

export const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('display_order')
        .order('created_at');

      if (categoriesData) setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  const getCategoryFilterUrl = (categoryName: string) => {
    // Convert category name to URL-friendly format for filtering
    return `/products?category=${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`;
  };

  return (
    <section className="py-20 bg-theme-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-theme-text-primary mb-4">
            Our Product Categories
          </h2>
          <p className="text-xl text-theme-text-secondary max-w-3xl mx-auto">
            Explore our carefully curated collection of natural and sustainable products, each crafted with the finest ingredients from Nepal's pristine environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Card 
              key={category.id} 
              className="group cursor-pointer border-theme-border hover:border-theme-primary transition-all duration-300 hover:shadow-xl animate-scale-in h-full flex flex-col"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-semibold text-theme-text-primary mb-2 group-hover:text-theme-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-theme-text-muted mb-4 leading-relaxed flex-grow">
                  {category.description}
                </p>
                <div className="mt-auto">
                  <Button 
                    variant="ghost" 
                    className="w-full text-theme-primary hover:bg-theme-hero-bg"
                    asChild
                  >
                    <Link to={getCategoryFilterUrl(category.name)}>
                      Explore Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
