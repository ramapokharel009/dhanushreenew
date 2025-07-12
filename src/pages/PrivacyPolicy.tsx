
import { Layout } from '@/components/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg mx-auto">
          <h1 className="text-4xl font-bold text-theme-text-primary mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-theme-text-secondary">
            <p>
              At Dhanushree Industries, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email address, phone number, and shipping address when you make purchases or contact us. We also collect non-personal information about your website usage through cookies and analytics tools.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">How We Use Your Information</h2>
            <p>
              Your information is used to process orders, provide customer support, improve our services, and communicate with you about products and promotions. We never sell or share your personal information with third parties without your consent.
            </p>
            
            <h2 className="text-2xl font-semibold text-theme-text-primary mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our contact page or email us directly.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
