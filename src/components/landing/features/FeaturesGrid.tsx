
import React from 'react';
import { Calendar, TrendingUp, FileSpreadsheet, Users } from 'lucide-react';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { FeatureCard } from './FeatureCard';

export const FeaturesGrid = () => {
  const { elementRef: featuresRef, visibleItems } = useStaggeredAnimation(4, 150);

  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: "Resource Planning Grid",
      description: "Visual team planning with clear project allocation across weeks and months.",
      highlight: true
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Smart Insights",
      description: "Dashboard analytics that help you understand team utilization and capacity trends."
    },
    {
      icon: <FileSpreadsheet className="w-8 h-8 text-purple-600" />,
      title: "Project Management",
      description: "Track projects, stages, and fees with integrated resource allocation."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Team Overview",
      description: "Monitor team workload, leave, and availability at a glance."
    }
  ];

  return (
    <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {features.map((feature, index) => (
        <FeatureCard 
          key={index} 
          icon={feature.icon} 
          title={feature.title} 
          description={feature.description}
          highlight={feature.highlight}
          index={index}
          isVisible={visibleItems.includes(index)}
        />
      ))}
    </div>
  );
};
