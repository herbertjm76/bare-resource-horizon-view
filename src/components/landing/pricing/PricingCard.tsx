import React, { useState } from 'react';
import { Check, ArrowRight, Star, Sparkles } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { EarlyAccessModal } from './EarlyAccessModal';

interface PricingCardProps {
  plan: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
    note: string;
    color: string;
    icon: React.ReactNode;
    badge: string;
  };
  index: number;
}

export const PricingCard = ({ plan, index }: PricingCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AnimatedSection 
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
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-foreground px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
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
                <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                  {plan.badge}
                </span>
              </div>
            )}
            
            <h3 className={`text-xl font-bold mb-2 ${
              plan.popular ? 'text-white' : 'text-foreground'
            }`}>
              {plan.name}
            </h3>
            
            <div className="mb-3">
              <span className={`text-4xl font-bold ${
                plan.popular ? 'text-white' : 'text-foreground'
              }`}>
                {plan.price}
              </span>
              <span className={`text-lg ml-1 ${
                plan.popular ? 'text-white/80' : 'text-muted-foreground'
              }`}>
                /{plan.period}
              </span>
            </div>
            
            <p className={`mb-2 ${
              plan.popular ? 'text-white/90' : 'text-muted-foreground'
            }`}>
              {plan.description}
            </p>
            <p className={`text-sm font-medium ${
              plan.popular ? 'text-white/70' : 'text-amber-600'
            }`}>
              {plan.note}
            </p>
          </div>
          
          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, featureIndex) => (
              <li 
                key={featureIndex} 
                className={`flex items-start gap-3 ${
                  plan.popular ? 'text-white/90' : 'text-muted-foreground'
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
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-500 transform group-hover:scale-105 flex items-center justify-center gap-2 ${
              plan.popular 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {plan.cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </AnimatedSection>

      <EarlyAccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        planName={plan.name}
      />
    </>
  );
};
