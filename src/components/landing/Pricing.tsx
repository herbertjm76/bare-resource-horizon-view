
import { Check, ArrowRight, Star } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Standard",
      price: "$29",
      period: "per user/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 10 team members",
        "Basic resource allocation",
        "Project timeline tracking",
        "Standard reporting",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Pro",
      price: "$49",
      period: "per user/month",
      description: "Advanced features for growing teams",
      features: [
        "Up to 50 team members",
        "AI-powered planning",
        "Advanced analytics",
        "Custom reporting",
        "Priority support",
        "Workload balancing"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "Tailored solutions for large organizations",
      features: [
        "Unlimited team members",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced security",
        "24/7 phone support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div id="pricing" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-green-100 rounded-full text-green-600 font-semibold text-sm mb-4">
            💰 Simple Pricing
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Choose Your Growth Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free, scale smart. All plans include 14-day free trial with no credit card required.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative p-6 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-105' 
                  : 'bg-white shadow-lg border border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full font-semibold text-sm flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold mb-2 ${
                  plan.popular ? 'text-white' : 'text-gray-900'
                }`}>
                  {plan.name}
                </h3>
                <div className="mb-3">
                  <span className={`text-3xl font-bold ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${
                    plan.popular ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`text-sm ${
                  plan.popular ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {plan.description}
                </p>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      plan.popular ? 'bg-white/20' : 'bg-green-100'
                    }`}>
                      <Check className={`w-3 h-3 ${
                        plan.popular ? 'text-white' : 'text-green-600'
                      }`} />
                    </div>
                    <span className={`text-sm ${
                      plan.popular ? 'text-white/90' : 'text-gray-600'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                plan.popular 
                  ? 'bg-white text-purple-600 hover:bg-gray-100' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
              }`}>
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Bottom Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            All plans include SSL security, data backups, and 99.9% uptime guarantee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
