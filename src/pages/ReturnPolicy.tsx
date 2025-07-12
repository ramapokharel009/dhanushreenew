
import { Layout } from '@/components/Layout';

const ReturnPolicy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg mx-auto">
          <h1 className="text-4xl font-bold text-theme-text-primary mb-8">Return Policy</h1>
          
          <div className="space-y-6 text-theme-text-secondary">
            <p>
              We want you to be completely satisfied with your purchase from Dhanushree Industries. If you're not happy with your order, we're here to help with returns and exchanges.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Return Window</h2>
            <p>
              You have 30 days from the date of delivery to return eligible items. Items must be unused, in original packaging, and in the same condition as when you received them.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Non-Returnable Items</h2>
            <p>
              Due to health and safety reasons, certain items cannot be returned, including opened cosmetics, personal care items, and perishable goods. Custom or personalized items are also non-returnable.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Return Process</h2>
            <p>
              To initiate a return, please contact our customer service team with your order number and reason for return. We'll provide you with return instructions and a prepaid shipping label if applicable.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Refunds</h2>
            <p>
              Once we receive and inspect your returned item, we'll process your refund within 5-7 business days. Refunds will be issued to the original payment method.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnPolicy;
