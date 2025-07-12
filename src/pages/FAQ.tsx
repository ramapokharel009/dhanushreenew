
import { Layout } from '@/components/Layout';

const FAQ = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg mx-auto">
          <h1 className="text-4xl font-bold text-theme-text-primary mb-8">Frequently Asked Questions</h1>
          
          <div className="space-y-8 text-theme-text-secondary">
            <div>
              <h2 className="text-2xl font-semibold text-theme-text-primary mb-4">What makes your products natural and organic?</h2>
              <p>
                All our products are made from natural ingredients sourced from Nepal's pristine environments. We use traditional methods combined with modern quality standards to ensure purity and effectiveness without harmful chemicals or synthetic additives.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-theme-text-primary mb-4">How do I place an order?</h2>
              <p>
                You can browse our products online and contact us directly through our website or phone to place an order. We'll guide you through the process and arrange payment and delivery options that work best for you.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-theme-text-primary mb-4">Do you ship internationally?</h2>
              <p>
                Currently, we primarily serve customers within Nepal, but we are expanding our shipping capabilities to select international destinations. Please contact us to inquire about shipping to your location.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-theme-text-primary mb-4">Are your products suitable for sensitive skin?</h2>
              <p>
                Our natural formulations are generally gentle and suitable for most skin types, including sensitive skin. However, we recommend doing a patch test before using any new product and consulting with a healthcare professional if you have specific concerns.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-theme-text-primary mb-4">How should I store the products?</h2>
              <p>
                Store products in a cool, dry place away from direct sunlight. Some products may require refrigeration - check individual product labels for specific storage instructions. Proper storage helps maintain product quality and extends shelf life.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-theme-text-primary mb-4">Can I customize or bulk order products?</h2>
              <p>
                Yes, we offer customization options for certain products and provide bulk ordering for businesses and organizations. Contact us directly to discuss your specific requirements and pricing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
