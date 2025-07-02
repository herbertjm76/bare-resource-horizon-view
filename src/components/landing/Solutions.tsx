import React from 'react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { VisualCard } from '@/components/common/VisualElements';
import { Building2, Target, Users, TrendingUp } from 'lucide-react';

const Solutions = () => {
  const solutions = [
    {
      icon: <Building2 className="w-8 h-8 text-blue-600" />,
      title: "Enterprise Resource Planning",
      description: "Scale your resource management across multiple departments and projects with enterprise-grade planning tools.",
      benefits: ["Multi-department coordination", "Advanced reporting", "Custom workflows"]
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "Project Portfolio Management",
      description: "Optimize resource allocation across your entire project portfolio for maximum efficiency and ROI.",
      benefits: ["Portfolio optimization", "Resource forecasting", "Risk management"]
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Team Capacity Planning",
      description: "Ensure optimal team utilization while preventing burnout with intelligent capacity planning.",
      benefits: ["Workload balancing", "Skill matching", "Capacity forecasting"]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: "Performance Analytics",
      description: "Make data-driven decisions with comprehensive analytics on team performance and resource utilization.",
      benefits: ["Real-time insights", "Predictive analytics", "Custom dashboards"]
    }
  ];

  return (
    <div id="solutions" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Solutions for Every Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From small teams to enterprise organizations, our resource management solutions 
              adapt to your unique needs and scale with your growth.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <AnimatedSection key={index} animation="fadeInUp" delay={index * 150}>
              <VisualCard className="h-full p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-gray-100 rounded-lg">
                    {solution.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {solution.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {solution.description}
                    </p>
                    <ul className="space-y-2">
                      {solution.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-3"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </VisualCard>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fadeInUp" delay={600}>
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg">
              Explore Case Studies
            </button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Solutions;