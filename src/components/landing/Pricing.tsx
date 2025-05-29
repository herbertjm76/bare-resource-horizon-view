
import { Check, ArrowRight, Star } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$59",
      period: "per month",
      description: "Perfect for small teams ditching spreadsheets",
      features: [
        "Up to 10 team members",
        "Visual resource planning",
        "Project timeline tracking", 
        "Basic reporting",
        "Email support",
        "Excel import"
      ],
      cta: "Start Free Trial",
      popular: false,
      note: "Billed annually ($590/year)"
    },
    {
      name: "Studio",
      price: "$99",
      period: "per month",
      description: "Adds AI insights and dashboard analytics",
      features: [
        "Everything in Starter",
        "Up to 25 team members",
        "🧠 AI hiring recommendations",
        "🧠 AI pipeline warnings",
        "🧠 AI burnout prevention",
        "Advanced dashboard analytics",
        "Team utilization insights",
        "Priority support"
      ],
      cta: "Start Free Trial", 
      popular: true,
      note: "Billed annually ($990/year)"
    },
    {
      name: "Agency",
      price: "$200",
      period: "per month", 
      description: "Adds financial management and multi-office support",
      features: [
        "Everything in Studio",
        "Unlimited team members",
        "💰 Project profitability tracking",
        "💰 Financial reporting",
        "💰 Revenue forecasting",
        "Multi-office management",
        "Custom client reporting",
        "Dedicated account manager",
        "White-label options"
      ],
      cta: "Start Free Trial",
      popular: false,
      note: "Billed annually ($2,000/year)"
    }
  ];

  return (
    <div id="pricing" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-green-100 rounded-full text-green-600 font-semibold text-sm mb-4">
            💰 Simple Flat Rate Pricing
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            One Price, No Per-Person Fees
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Predictable pricing that won't surprise you as your team grows. All plans include 14-day free trial.
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
                <p className={`text-sm mb-2 ${
                  plan.popular ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {plan.description}
                </p>
                <p className={`text-xs ${
                  plan.popular ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {plan.note}
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
                    } ${feature.includes('🧠') || feature.includes('💰') ? 'font-semibold' : ''}`}>
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
        <div className="text-center mt-8 space-y-2">
          <p className="text-gray-600 text-sm font-medium">
            🎯 Perfect for 5-25 person design teams
          </p>
          <p className="text-gray-500 text-sm">
            All plans include SSL security, daily backups, and 99.9% uptime guarantee. Scale without per-person fees.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
