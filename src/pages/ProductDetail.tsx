import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { ContactModal } from '@/components/ContactModal';
import { useContactModal } from '@/hooks/useContactModal';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  availability: boolean;
  is_featured: boolean;
  ingredients?: string;
  usage_instructions?: string;
  benefits?: string;
  categories: {
    name: string;
  };
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNprPrice, setShowNprPrice] = useState(false);
  const { toast } = useToast();
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

    // Set up real-time subscription to listen for changes
    const subscription = supabase
      .channel('price-toggle-changes-detail')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings',
          filter: `key=eq.show_npr_price`
        },
        (payload) => {
          if (payload.new?.value) {
            const value = payload.new.value;
            setShowNprPrice(value === 'true' || value === true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      // Fetch product details
      const { data: productData } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('id', id)
        .single();

      if (productData) {
        setProduct(productData);
        
        // Fetch related products from same category
        const { data: relatedData } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              name
            )
          `)
          .eq('category_id', productData.category_id)
          .neq('id', id)
          .limit(4);
        
        if (relatedData) {
          setRelatedProducts(relatedData);
        }
      }
      
      setIsLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToWishlist = () => {
    toast({
      title: "Added to Wishlist",
      description: `${product?.name} has been added to your wishlist.`,
    });
  };

  const handleContactToBuy = () => {
    if (product) {
      openModal({ productName: product.name, productId: product.id });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link has been copied to your clipboard.",
      });
    }
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

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-theme-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-theme-text-primary mb-4">Product Not Found</h1>
            <Button asChild className="bg-theme-button-primary hover:bg-theme-button-primary-hover text-white">
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-theme-surface py-4 border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-theme-text-muted">
            <Link to="/" className="hover:text-theme-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-theme-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-theme-text-primary">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-16 bg-theme-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="mb-8 text-theme-primary hover:bg-theme-hero-bg"
            asChild
          >
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="animate-fade-in">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=600&h=500&fit=crop';
                  }}
                />
                {product.is_featured && (
                  <Badge className="absolute top-4 left-4 bg-theme-primary text-white">
                    Featured Product
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6 animate-slide-in-right">
              <div>
                <Badge variant="secondary" className="mb-2 bg-theme-hero-bg text-theme-primary">
                  {product.categories?.name}
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-theme-text-primary mb-4">
                  {product.name}
                </h1>
                <p className="text-xl text-theme-text-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {showNprPrice && product.price && (
                  <span className="text-4xl font-bold text-theme-primary">
                    NPR {product.price?.toLocaleString()}
                  </span>
                )}
                <Badge 
                  variant={product.availability ? "default" : "destructive"}
                  className={product.availability ? "bg-green-100 text-green-800" : ""}
                >
                  {product.availability ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-theme-button-primary hover:bg-theme-button-primary-hover text-white"
                  disabled={!product.availability}
                  onClick={handleContactToBuy}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.availability ? "Contact to Buy" : "Out of Stock"}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleAddToWishlist}
                  className="border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleShare}
                  className="border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="bg-theme-hero-bg p-6 rounded-lg">
                <h3 className="font-semibold text-theme-text-primary mb-3 flex items-center">
                  <Info className="mr-2 h-5 w-5 text-theme-primary" />
                  Key Features
                </h3>
                <ul className="space-y-2 text-theme-text-secondary">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    100% Natural Ingredients
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Eco-Friendly Packaging
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Sustainably Sourced
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Made in Nepal
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-theme-surface">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-8">
                <Card className="border-theme-border">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-theme-text-primary mb-4">
                      Product Description
                    </h3>
                    <p className="text-theme-text-secondary leading-relaxed">
                      {product.description || "No detailed description available for this product."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ingredients" className="mt-8">
                <Card className="border-theme-border">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-theme-text-primary mb-4">
                      Ingredients
                    </h3>
                    <p className="text-theme-text-secondary leading-relaxed">
                      {product.ingredients || "Ingredient information will be updated soon."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="usage" className="mt-8">
                <Card className="border-theme-border">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-theme-text-primary mb-4">
                      Usage Instructions
                    </h3>
                    <p className="text-theme-text-secondary leading-relaxed">
                      {product.usage_instructions || "Usage instructions will be provided with the product."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="benefits" className="mt-8">
                <Card className="border-theme-border">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-theme-text-primary mb-4">
                      Benefits
                    </h3>
                    <p className="text-theme-text-secondary leading-relaxed">
                      {product.benefits || "This product offers various health and wellness benefits."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-theme-text-primary mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card 
                    key={relatedProduct.id}
                    className="group cursor-pointer border-theme-border hover:border-theme-primary transition-all duration-300 hover:shadow-lg"
                  >
                    <CardContent className="p-0">
                      <Link to={`/products/${relatedProduct.id}`}>
                        <div className="relative overflow-hidden">
                          <img
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=400&h=300&fit=crop';
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-theme-text-primary mb-2 group-hover:text-theme-primary transition-colors">
                            {relatedProduct.name}
                          </h3>
                          <p className="text-sm text-theme-text-muted mb-2 line-clamp-2">
                            {relatedProduct.description}
                          </p>
                          {showNprPrice && relatedProduct.price && (
                            <span className="text-lg font-bold text-theme-primary">
                              NPR {relatedProduct.price?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <ContactModal
        isOpen={isOpen}
        onClose={closeModal}
        productName={contactData.productName}
        productId={contactData.productId}
      />
    </Layout>
  );
};

export default ProductDetail;
