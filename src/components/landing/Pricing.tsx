
import { Check, ArrowRight, Star, Zap, Users, Brain, Sparkles, Target } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { VisualCard, IconSeparator, GradientOrbs } from '@/components/common/VisualElements';

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
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false,
      note: "Billed annually ($590/year)",
      color: "from-gray-600 to-gray-700",
      icon: <Users className="w-5 h-5" />,
      badge: "Essential"
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
        "Priority support"
      ],
      cta: "Start Free Trial", 
      popular: true,
      note: "Billed annually ($990/year)",
      color: "from-purple-600 to-blue-600",
      icon: <Brain className="w-5 h-5" />,
      badge: "Most Popular"
    }
  ];

  return (
    <div id="pricing" className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <GradientOrbs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection animation="fadeInUp" className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center animate-pulse">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="inline-flex items-center px-3 py-1 bg-green-100 rounded-full text-green-600 font-semibold text-sm mb-1">
                Simple Flat Rate Pricing
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                One Price, No Surprises
              </h2>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Predictable pricing that scales with your team. All plans include 14-day free trial.
          </p>
        </AnimatedSection>
        
        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <AnimatedSection 
              key={index}
              animation="scaleIn"
              delay={index * 200}
              className={`relative rounded-2xl transition-all duration-700 hover:shadow-2xl group ${
                plan.popular 
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-105 shadow-2xl' 
                  : 'bg-white shadow-lg border border-gray-100 hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    {plan.badge}
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              )}
              
              <div className="relative p-6">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-3 transition-all duration-500 group-hover:scale-110 ${
                    plan.popular ? 'bg-white/20' : ''
                  }`}>
                    <div className={plan.popular ? 'text-white' : 'text-white'}>
                      {plan.icon}
                    </div>
                  </div>
                  
                  {!plan.popular && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  
                  <h3 className={`text-xl font-bold mb-2 ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </h3>
                  
                  <div className="mb-3">
                    <span className={`text-4xl font-bold ${
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
                  
                  <p className={`mb-2 ${
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
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className={`flex items-start gap-3 ${
                        plan.popular ? 'text-white/90' : 'text-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'bg-white/20' : 'bg-green-100'
                      }`}>
                        <Check className={`w-3 h-3 ${
                          plan.popular ? 'text-white' : 'text-green-600'
                        }`} />
                      </div>
                      <span className={`text-sm ${feature.includes('🧠') ? 'font-semibold' : ''}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-500 transform group-hover:scale-105 flex items-center justify-center gap-2 ${
                  plan.popular 
                    ? 'bg-white text-purple-600 hover:bg-gray-100' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                }`}>
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 text-center">
          {[
            { icon: Check, title: "No Setup Fees", description: "Start using immediately with zero upfront costs", color: "green", stat: "$0" },
            { icon: Users, title: "Perfect for 5-25 Teams", description: "Designed specifically for design studios", color: "blue", stat: "25" },
            { icon: Brain, title: "AI Included", description: "Smart insights come standard, not as an add-on", color: "purple", stat: "24/7" }
          ].map((item, index) => (
            <AnimatedSection key={index} animation="fadeInUp" delay={index * 150}>
              <VisualCard className="text-center p-4">
                <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </div>
                <div className={`text-2xl font-bold text-${item.color}-600 mb-2`}>{item.stat}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </VisualCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
