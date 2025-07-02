import React from 'react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { VisualCard } from '@/components/common/VisualElements';
import { BarChart3, Calendar, Users, Settings, FileText, Target } from 'lucide-react';

const AppTour = () => {
  const appPages = [
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      title: "Dashboard",
      description: "Get a comprehensive overview of your team's performance, project status, and resource utilization.",
      features: ["Real-time metrics", "Smart insights", "Executive summaries"]
    },
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      title: "Weekly Overview",
      description: "Plan and track weekly resource allocations with visual capacity management and project timelines.",
      features: ["Capacity planning", "Resource allocation", "Timeline views"]
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "Team Management",
      description: "Manage your team members, track their skills, and optimize assignments based on availability.",
      features: ["Team profiles", "Skill tracking", "Availability management"]
    },
    {
      icon: <Target className="w-6 h-6 text-orange-600" />,
      title: "Project Resourcing",
      description: "Allocate resources efficiently across projects with advanced planning and forecasting tools.",
      features: ["Resource planning", "Project allocation", "Milestone tracking"]
    },
    {
      icon: <FileText className="w-6 h-6 text-red-600" />,
      title: "Annual Leave",
      description: "Track and manage team vacation schedules with conflict detection and approval workflows.",
      features: ["Leave calendars", "Conflict detection", "Approval workflows"]
    },
    {
      icon: <Settings className="w-6 h-6 text-gray-600" />,
      title: "Office Settings",
      description: "Configure your workspace settings, departments, roles, and organizational structure.",
      features: ["Organization setup", "Role management", "Custom configurations"]
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appPages.map((page, index) => (
            <AnimatedSection key={index} animation="fadeInUp" delay={index * 100}>
              <VisualCard className="h-full p-6 hover:shadow-lg transition-all hover:scale-105">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {page.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {page.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">
                  {page.description}
                </p>
                
                <div className="space-y-2">
                  {page.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-xs text-gray-700">
                      <div className="w-1 h-1 bg-purple-600 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </VisualCard>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fadeInUp" delay={600}>
          <div className="text-center mt-12">
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