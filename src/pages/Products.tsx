import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { ProductCard } from '@/components/ProductCard';
import { useQuery } from '@tanstack/react-query';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  availability: boolean;
  is_featured: boolean;
  category_id: string;
  display_order: number;
  categories: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  display_order: number;
}

interface ProductsPageContent {
  title: string;
  description: string;
  empty_state_message: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: productsPageContent } = useQuery({
    queryKey: ['products-page-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'products_page')
        .single();
      
      if (error) throw error;
      return data?.value as unknown as ProductsPageContent;
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch products with category information and display order
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('availability', true)
        .order('display_order')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      // Fetch categories with display order
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('display_order')
        .order('name');

      if (productsData) setProducts(productsData);
      if (categoriesData) setCategories(categoriesData);
      
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Check for category filter from URL params - handle both 'category' and 'filter_by'
    const categoryParam = searchParams.get('category') || searchParams.get('filter_by');
    if (categoryParam) {
      // Find the category that matches the URL parameter
      const matchedCategory = categories.find(cat => 
        cat.name.toLowerCase().replace(/\s+/g, '-') === categoryParam ||
        cat.name.toLowerCase() === categoryParam ||
        cat.name === categoryParam
      );
      
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.name.toLowerCase().replace(/\s+/g, '-'));
      } else {
        setSelectedCategory(categoryParam);
      }
    }
  }, [searchParams, categories]);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        if (!product.categories) return false;
        
        const categorySlug = product.categories.name.toLowerCase().replace(/\s+/g, '-');
        const categoryName = product.categories.name.toLowerCase();
        const originalCategoryName = product.categories.name;
        
        return categorySlug === selectedCategory || 
               categoryName === selectedCategory ||
               originalCategoryName === selectedCategory;
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    
    // Update URL parameters - use 'category' as the primary parameter
    if (value === 'all') {
      searchParams.delete('category');
      searchParams.delete('filter_by'); // Also remove filter_by if it exists
    } else {
      searchParams.set('category', value);
      searchParams.delete('filter_by'); // Remove filter_by to avoid conflicts
    }
    setSearchParams(searchParams);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-theme-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-theme-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-theme-hero-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-theme-hero-text mb-4">
              {productsPageContent?.title || 'Our Natural Products'}
            </h1>
            <p className="text-xl text-theme-text-secondary max-w-3xl mx-auto">
              {productsPageContent?.description || 'Discover our complete range of natural, organic, and eco-friendly products crafted with care for your well-being and the environment.'}
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-theme-surface py-8 sticky top-16 z-40 border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-muted h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-theme-border focus:border-theme-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-theme-text-muted" />
                <span className="text-sm font-medium text-theme-text-secondary">Filter by:</span>
              </div>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-48 border-theme-border">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.name.toLowerCase().replace(/\s+/g, '-')}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-theme-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-theme-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-theme-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-theme-text-primary mb-4">
                No products found
              </h3>
              <p className="text-theme-text-muted mb-8">
                {productsPageContent?.empty_state_message || 'Try adjusting your search terms or filters to find what you\'re looking for.'}
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  searchParams.delete('category');
                  searchParams.delete('filter_by');
                  setSearchParams(searchParams);
                }}
                className="bg-theme-button-primary hover:bg-theme-button-primary-hover text-white"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-theme-text-primary">
                  {filteredProducts.length} Product{filteredProducts.length !== 1 && 's'} Found
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showCategory={true}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
