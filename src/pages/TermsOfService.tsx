
import { Layout } from '@/components/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg mx-auto">
          <h1 className="text-4xl font-bold text-theme-text-primary mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-theme-text-secondary">
            <p>
              Welcome to Dhanushree Industries. These Terms of Service govern your use of our website and services. By accessing or using our services, you agree to be bound by these terms.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Use of Services</h2>
            <p>
              You may use our services for lawful purposes only. You agree not to use our services in any way that could damage, disable, or impair our website or interfere with other users' access to our services.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Product Information</h2>
            <p>
              We strive to provide accurate product information, but we do not warrant that product descriptions or content is accurate, complete, or error-free. All products are subject to availability.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Limitation of Liability</h2>
            <p>
              Dhanushree Industries shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services or products.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
