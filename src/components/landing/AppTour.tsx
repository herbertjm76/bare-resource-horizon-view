import React from 'react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { VisualCard } from '@/components/common/VisualElements';
import { BarChart3, Calendar, Users, Settings, FileText, Target } from 'lucide-react';

const AppTour = () => {
  const appFeatures = [
    {
      icon: <BarChart3 className="w-16 h-16" />,
      title: "Dashboard",
      description: "Comprehensive analytics and insights"
    },
    {
      icon: <Calendar className="w-16 h-16" />,
      title: "Weekly Overview", 
      description: "Visual capacity planning"
    },
    {
      icon: <Users className="w-16 h-16" />,
      title: "Team Management",
      description: "Complete team coordination"
    },
    {
      icon: <Target className="w-16 h-16" />,
      title: "Project Resourcing",
      description: "Strategic resource allocation"
    },
    {
      icon: <FileText className="w-16 h-16" />,
      title: "Annual Leave",
      description: "Smart vacation planning"
    },
    {
      icon: <Settings className="w-16 h-16" />,
      title: "Office Settings",
      description: "Complete workspace control"
    }
  ];

  return (
    <div id="app-tour" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore the Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover all the powerful features and pages that make resource management 
              effortless and efficient for your team.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {appFeatures.map((feature, index) => (
            <AnimatedSection key={index} animation="fadeInUp" delay={index * 100}>
              <div className="group text-center">
                <div className="relative mb-4 mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 flex items-center justify-center border border-purple-200/30 shadow-lg backdrop-blur-sm group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl"></div>
                  <div className="relative text-purple-600 group-hover:text-purple-700 transition-colors">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {feature.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fadeInUp" delay={600}>
          <div className="text-center mt-16">
            <button className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg mr-4">
              Try Demo
            </button>
            <button className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
              View Screenshots
            </button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default AppTour;