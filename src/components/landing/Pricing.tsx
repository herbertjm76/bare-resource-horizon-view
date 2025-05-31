
import { Check, ArrowRight, Star, Zap, Users, Brain, Sparkles, Target, Shield } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { CountUpNumber } from '@/components/common/CountUpNumber';
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
        "Email support",
        "Excel import"
      ],
      cta: "Start Free Trial",
      popular: false,
      note: "Billed annually ($590/year)",
      color: "from-gray-600 to-gray-700",
      icon: <Users className="w-6 h-6" />,
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
        "Team utilization insights",
        "Priority support"
      ],
      cta: "Start Free Trial", 
      popular: true,
      note: "Billed annually ($990/year)",
      color: "from-purple-600 to-blue-600",
      icon: <Brain className="w-6 h-6" />,
      badge: "Most Popular"
    }
  ];

  return (
    <div id="pricing" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <GradientOrbs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <AnimatedSection animation="fadeInUp" className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                <Zap className="w-8 h-8 text-white animate-bounce" />
              </div>
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-600 font-semibold text-sm mb-2 transition-all duration-300 hover:bg-green-200 hover:scale-105">
                  Simple Flat Rate Pricing
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  One Price, No Surprises
                </h2>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite] animation-delay-500">
                <Target className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Predictable pricing that scales with your team. All plans include 14-day free trial.
          </p>
        </AnimatedSection>
        
        <IconSeparator icon={Star} color="green" />
        
        {/* Enhanced Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <AnimatedSection 
              key={index}
              animation="scaleIn"
              delay={index * 200}
              className={`relative rounded-3xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-4 group ${
                plan.popular 
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-105 shadow-2xl' 
                  : 'bg-white shadow-lg border border-gray-100 hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-[bounce_2s_ease-in-out_infinite]">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg">
                    <Star className="w-5 h-5 animate-spin" />
                    {plan.badge}
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
              )}
              
              {/* Visual background pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                <div className={`w-full h-full bg-gradient-to-br ${plan.color} rounded-full blur-2xl`}></div>
              </div>
              
              <div className="relative p-8">
                {/* Enhanced Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 ${
                    plan.popular ? 'bg-white/20 animate-[float_3s_ease-in-out_infinite]' : ''
                  }`}>
                    <div className={plan.popular ? 'text-white' : 'text-white'}>
                      {plan.icon}
                    </div>
                  </div>
                  
                  {!plan.popular && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  
                  <h3 className={`text-2xl font-bold mb-2 ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className={`text-5xl lg:text-6xl font-bold ${
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
                
                {/* Enhanced Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className={`flex items-start gap-3 transition-all duration-300 hover:translate-x-2 ${
                        plan.popular ? 'hover:text-white' : 'hover:text-purple-600'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 transition-all duration-300 ${
                        plan.popular ? 'bg-white/20' : 'bg-green-100'
                      }`}>
                        <Check className={`w-4 h-4 ${
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
                
                {/* Enhanced CTA Button */}
                <button className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-500 transform group-hover:scale-110 flex items-center justify-center gap-3 ${
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
        
        <IconSeparator icon={Shield} color="blue" />
        
        {/* Enhanced Value Props */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { icon: Check, title: "No Setup Fees", description: "Start using immediately with zero upfront costs", color: "green", stat: "0$" },
            { icon: Users, title: "Perfect for 5-25 Teams", description: "Designed specifically for design studios", color: "blue", stat: "25" },
            { icon: Brain, title: "AI Included", description: "Smart insights come standard, not as an add-on", color: "purple", stat: "24/7" }
          ].map((item, index) => (
            <AnimatedSection key={index} animation="fadeInUp" delay={index * 200}>
              <VisualCard className="text-center hover:shadow-2xl hover:-translate-y-4 hover:scale-105">
                <div className={`w-16 h-16 bg-${item.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:scale-125 hover:rotate-12`}>
                  <item.icon className={`w-8 h-8 text-${item.color}-600`} />
                </div>
                <div className={`text-3xl font-bold text-${item.color}-600 mb-2`}>{item.stat}</div>
                <h3 className="font-bold text-gray-900 mb-3 transition-colors duration-300 hover:text-purple-600">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </VisualCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
