
import { Leaf, Shield, Heart, Award } from 'lucide-react';

export const WhyChooseUsSection = () => {
  const features = [
    {
      icon: Leaf,
      title: "100% Natural",
      description: "All our products are made from pure, natural ingredients sourced from Nepal's pristine environment."
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Rigorous testing and quality control ensure every product meets our high standards."
    },
    {
      icon: Heart,
      title: "Ethically Sourced",
      description: "We work directly with local farmers and communities to ensure fair trade practices."
    },
    {
      icon: Award,
      title: "Certified Organic",
      description: "Our products are certified organic and meet international quality standards."
    }
  ];

  return (
    <section className="py-20 bg-theme-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold text-theme-text-primary mb-4">
            Why Choose Dhanushree Industries?
          </h2>
          <p className="text-xl text-theme-text-secondary max-w-3xl mx-auto">
            We're committed to delivering the highest quality natural products while maintaining our responsibility to the environment and our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center group animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-theme-primary rounded-full mb-6 group-hover:bg-theme-secondary transition-colors">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-theme-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-theme-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
