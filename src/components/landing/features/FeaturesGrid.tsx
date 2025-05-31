
import React from 'react';
import { Brain, TrendingUp, FileSpreadsheet, Calendar } from 'lucide-react';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { FeatureCard } from './FeatureCard';

export const FeaturesGrid = () => {
  const { elementRef: featuresRef, visibleItems } = useStaggeredAnimation(4, 150);

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI Business Insights",
      description: "Get alerts when your team needs expansion or when utilization drops below optimal levels.",
      highlight: true,
      premium: true
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Smart Hiring Alerts",
      description: "AI analyzes trends and tells you when your team needs expansion.",
      premium: true
    },
    {
      icon: <FileSpreadsheet className="w-8 h-8 text-purple-600" />,
      title: "Visual Resource Grid",
      description: "See your team's workload at a glance with intuitive planning."
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: "Smart Scheduling",
      description: "Drag and drop to allocate people to projects."
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
          premium={feature.premium}
          index={index}
          isVisible={visibleItems.includes(index)}
        />
      ))}
    </div>
  );
};
