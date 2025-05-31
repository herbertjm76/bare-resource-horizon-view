
import React from 'react';
import { TrendingUp, Clock, Shield } from 'lucide-react';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { BenefitsCard } from './BenefitsCard';

export const BenefitsGrid = () => {
  const { elementRef: benefitsRef, visibleItems } = useStaggeredAnimation(3, 150);

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Utilization Insights",
      description: "Track team capacity and utilization",
      example: "Team utilization at 85%",
      color: "from-purple-500 to-blue-500",
      stats: "Real-time"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Project Planning", 
      description: "Visual resource allocation planning",
      example: "Q2 project capacity overview",
      color: "from-blue-500 to-cyan-500",
      stats: "Weekly"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Workload Management",
      description: "Monitor team workload balance",
      example: "Team workload distribution",
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
          stats={benefit.stats}
          index={index}
          isVisible={visibleItems.includes(index)}
        />
      ))}
    </div>
  );
};
