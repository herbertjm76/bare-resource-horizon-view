
import { Check, ArrowRight, Star, Zap, Users, Brain } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { CountUpNumber } from '@/components/common/CountUpNumber';

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
      note: "Billed annually ($590/year)",
      color: "from-gray-600 to-gray-700",
      icon: <Users className="w-5 h-5" />
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
      note: "Billed annually ($990/year)",
      color: "from-purple-600 to-blue-600",
      icon: <Brain className="w-5 h-5" />
    }
  ];

  return (
    <div id="pricing" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection animation="fadeInUp" className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-600 font-semibold text-sm mb-6 transition-all duration-300 hover:bg-green-200 hover:scale-105">
            <Zap className="w-4 h-4 mr-2 animate-pulse" />
            Simple Flat Rate Pricing
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            One Price, No Surprises
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Predictable pricing that scales with your team. All plans include 14-day free trial.
          </p>
        </AnimatedSection>
        
        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <AnimatedSection 
              key={index}
              animation="scaleIn"
              delay={index * 200}
              className={`relative rounded-3xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-4 group ${
                plan.popular 
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-105 shadow-2xl animate-[pulse_4s_ease-in-out_infinite]' 
                  : 'bg-white shadow-lg border border-gray-100 hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-[bounce_2s_ease-in-out_infinite]">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                    <Star className="w-4 h-4 animate-spin" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 ${
                    plan.popular ? 'bg-white/20 animate-[float_3s_ease-in-out_infinite]' : ''
                  }`}>
                    <div className={plan.popular ? 'text-white' : 'text-white'}>
                      {plan.icon}
                    </div>
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-2 ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className={`text-4xl lg:text-5xl font-bold ${
                      plan.popular ? 'text-white' : 'text-gray-900'
                    }`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ml-1 ${
                      plan.popular ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      /{plan.period}
                    </span>
                  </div>
                  
                  <p className={`text-lg mb-2 ${
                    plan.popular ? 'text-white/90' : 'text-gray-600'
                  }`}>
                    {plan.description}
                  </p>
                  <p className={`text-sm ${
                    plan.popular ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {plan.note}
                  </p>
                </div>
                
                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className={`flex items-start gap-3 transition-all duration-300 hover:translate-x-1 ${
                        plan.popular ? 'hover:text-white' : 'hover:text-purple-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 transition-all duration-300 ${
                        plan.popular ? 'bg-white/20' : 'bg-green-100'
                      }`}>
                        <Check className={`w-3 h-3 ${
                          plan.popular ? 'text-white' : 'text-green-600'
                        }`} />
                      </div>
                      <span className={`${
                        plan.popular ? 'text-white/90' : 'text-gray-600'
                      } ${feature.includes('🧠') ? 'font-semibold' : ''}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <button className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-500 transform group-hover:scale-110 flex items-center justify-center gap-2 ${
                  plan.popular 
                    ? 'bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-2xl' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-2xl'
                }`}>
                  {plan.cta}
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
        
        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          {[
            { icon: Check, title: "No Setup Fees", description: "Start using immediately with zero upfront costs", color: "green" },
            { icon: Users, title: "Perfect for 5-25 Teams", description: "Designed specifically for design studios", color: "blue" },
            { icon: Brain, title: "AI Included", description: "Smart insights come standard, not as an add-on", color: "purple" }
          ].map((item, index) => (
            <AnimatedSection key={index} animation="fadeInUp" delay={index * 200}>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
                <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:scale-125 hover:rotate-12`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 transition-colors duration-300 hover:text-purple-600">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
