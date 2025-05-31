
import React from 'react';
import { Brain, TrendingUp, Shield } from 'lucide-react';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { BenefitsCard } from './BenefitsCard';

export const BenefitsGrid = () => {
  const { elementRef: benefitsRef, visibleItems } = useStaggeredAnimation(3, 150);

  const benefits = [
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI Hiring Alerts",
      description: "Know when to expand your team",
      example: "Team needs more designers",
      color: "from-purple-500 to-blue-500",
      premium: true,
      stats: "Real-time"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: "Pipeline Intelligence", 
      description: "Early warnings on project capacity",
      example: "Pipeline running low",
      color: "from-blue-500 to-cyan-500",
      premium: true,
      stats: "Predictive"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Burnout Prevention",
      description: "Prevent team overload",
      example: "High capacity warning",
      color: "from-green-500 to-emerald-500",
      stats: "Proactive"
    }
  ];

  return (
    <div ref={benefitsRef} className="grid md:grid-cols-3 gap-6 mb-12">
      {benefits.map((benefit, index) => (
        <BenefitsCard 
          key={index} 
          icon={benefit.icon}
          title={benefit.title}
          description={benefit.description}
          example={benefit.example}
          color={benefit.color}
          premium={benefit.premium}
          stats={benefit.stats}
          index={index}
          isVisible={visibleItems.includes(index)}
        />
      ))}
    </div>
  );
};
