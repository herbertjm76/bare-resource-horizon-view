
import React from 'react';
import { Check, Users, Brain } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { VisualCard } from '@/components/common/VisualElements';

export const PricingFeatures = () => {
  const features = [
    { icon: Check, title: "No Setup Fees", description: "Start using immediately with zero upfront costs", color: "green", stat: "$0" },
    { icon: Users, title: "Perfect for 5-25 Teams", description: "Designed specifically for design studios", color: "blue", stat: "25" },
    { icon: Brain, title: "AI Included", description: "Smart insights come standard, not as an add-on", color: "purple", stat: "24/7" }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 text-center">
      {features.map((item, index) => (
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
  );
};
