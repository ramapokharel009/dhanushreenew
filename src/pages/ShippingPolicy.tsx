
import { Layout } from '@/components/Layout';

const ShippingPolicy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg mx-auto">
          <h1 className="text-4xl font-bold text-theme-text-primary mb-8">Shipping Policy</h1>
          
          <div className="space-y-6 text-theme-text-secondary">
            <p>
              At Dhanushree Industries, we are committed to delivering your natural products safely and efficiently. Please review our shipping policy below for important information about delivery times, costs, and procedures.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Shipping Areas</h2>
            <p>
              We currently ship throughout Nepal and select international destinations. Shipping costs and delivery times vary by location and product weight.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Processing Time</h2>
            <p>
              Orders are typically processed within 1-2 business days. Custom or special orders may require additional processing time, which will be communicated at the time of order.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Delivery Options</h2>
            <p>
              We offer standard and express shipping options. Express shipping is available for urgent orders at an additional cost. All shipments are tracked and insured.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Damaged or Lost Items</h2>
            <p>
              If your order arrives damaged or goes missing, please contact us immediately. We will work to resolve the issue promptly, including replacement or refund as appropriate.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShippingPolicy;
