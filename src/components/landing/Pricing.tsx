
import { Check, ArrowRight, Star } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Standard",
      price: "$29",
      period: "per user/month",
      description: "Perfect for small teams getting started with resource planning",
      features: [
        "Up to 10 team members",
        "Basic resource allocation",
        "Project timeline tracking",
        "Standard reporting",
        "Email support",
        "Mobile app access"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Pro",
      price: "$49",
      period: "per user/month",
      description: "Advanced features for growing teams and complex projects",
      features: [
        "Up to 50 team members",
        "AI-powered planning",
        "Advanced analytics",
        "Custom reporting",
        "Priority support",
        "API access",
        "Workload balancing",
        "Predictive insights"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "Tailored solutions for large organizations with complex needs",
      features: [
        "Unlimited team members",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced security",
        "Custom workflows",
        "On-premise deployment",
        "24/7 phone support",
        "Training & onboarding"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div id="pricing" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-600 font-semibold text-sm mb-6">
            💰 Simple Pricing
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Choose Your Growth Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Start free, scale smart. All plans include 14-day free trial with no credit card required.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-105' 
                  : 'bg-white shadow-lg border border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${
                  plan.popular ? 'text-white' : 'text-gray-900'
                }`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ${
                    plan.popular ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`${
                  plan.popular ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {plan.description}
                </p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.popular ? 'bg-white/20' : 'bg-green-100'
                    }`}>
                      <Check className={`w-3 h-3 ${
                        plan.popular ? 'text-white' : 'text-green-600'
                      }`} />
                    </div>
                    <span className={`${
                      plan.popular ? 'text-white/90' : 'text-gray-600'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                plan.popular 
                  ? 'bg-white text-purple-600 hover:bg-gray-100' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
              }`}>
                {plan.cta}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            All plans include SSL security, data backups, and 99.9% uptime guarantee. 
            <br />
            Need something custom? <span className="text-purple-600 font-semibold cursor-pointer hover:text-purple-700">Contact our sales team</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
