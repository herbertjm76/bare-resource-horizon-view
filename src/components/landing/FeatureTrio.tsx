
import React from 'react';
import { Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { VisualCard } from '@/components/common/VisualElements';
import weeklySnapshotImage from '/lovable-uploads/5d7f036a-9d22-4daf-bae0-e9419c629c05.png';
import teamWorkloadImage from '/lovable-uploads/746bb40b-8a82-4c79-ba55-ccebee8a56a2.png';
import dashboardInsightsImage from '/lovable-uploads/95bdf626-548e-4fa4-b1f7-dc9a505b14bc.png';

const FeatureTrio = () => {
  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: "Weekly Snapshot",
      description: "Get a comprehensive view of your team's weekly allocations and capacity at a glance.",
      gif: weeklySnapshotImage
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: "Team Workload",
      description: "Monitor team workload distribution and identify capacity bottlenecks before they impact projects.",
      gif: teamWorkloadImage
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "Dashboard Insights",
      description: "Access intelligent analytics and actionable insights to optimize resource planning decisions.",
      gif: dashboardInsightsImage
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
