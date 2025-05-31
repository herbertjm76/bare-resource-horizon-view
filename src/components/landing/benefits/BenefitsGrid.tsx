
import React from 'react';
import { Brain, TrendingUp, Shield, Target } from 'lucide-react';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { BenefitsCard } from './BenefitsCard';

export const BenefitsGrid = () => {
  const { elementRef: benefitsRef, visibleItems } = useStaggeredAnimation(4, 150);

  const benefits = [
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI Hiring Alerts",
      description: "Know when to expand your team",
      example: "Need to hire more designers",
      color: "from-purple-500 to-blue-500",
      premium: true,
      stats: "Real-time"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: "Pipeline Intelligence", 
      description: "Early warnings on project capacity",
      example: "Need more projects in pipeline",
      color: "from-blue-500 to-cyan-500",
      premium: true,
      stats: "Predictive"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Burnout Prevention",
      description: "Prevent team overload",
      example: "Team approaching max capacity",
      color: "from-green-500 to-emerald-500",
      stats: "Proactive"
    },
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      title: "Smart Capacity Planning",
      description: "Optimize resource allocation",
      example: "Available capacity this week",
      color: "from-orange-500 to-red-500",
      stats: "Live data"
    }
  ];

  return (
    <div ref={benefitsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
