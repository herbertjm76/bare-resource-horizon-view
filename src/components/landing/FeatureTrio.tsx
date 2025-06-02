
import React from 'react';
import { Calendar, TrendingUp, Mail } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { VisualCard } from '@/components/common/VisualElements';

const FeatureTrio = () => {
  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: "Rolling Availability Calendar",
      description: "Drag people, capacity colours update.",
      gif: "/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: "Live Burn Meter",
      description: "Fee vs. hours bar turns amber/red.",
      gif: "/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png"
    },
    {
      icon: <Mail className="w-8 h-8 text-blue-600" />,
      title: "Morning Heads-Up",
      description: "Slack/email digest: clashes, gaps, leave.",
      gif: "/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png"
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={index} animation="fadeInUp" delay={index * 200}>
              <VisualCard className="text-center h-full">
                <div className="mb-6">
                  <img 
                    src={feature.gif} 
                    alt={feature.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                </div>
                
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </VisualCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureTrio;
