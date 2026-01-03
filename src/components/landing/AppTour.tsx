import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { VisualCard } from '@/components/common/VisualElements';
import { LayoutDashboard, Calendar, GanttChartSquare, UserSquare2, Flag, Play, TrendingUp, FolderKanban, User } from 'lucide-react';
import { useDemoAuth } from '@/hooks/useDemoAuth';

const AppTour = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startDemoMode } = useDemoAuth();
  const isMainPage = location.pathname === '/';
  
  const appFeatures = [
    {
      icon: <LayoutDashboard className="w-16 h-16" />,
      title: "Dashboard",
      description: "Comprehensive analytics and insights",
      bgColor: "from-purple-600 to-purple-700"
    },
    {
      icon: <Calendar className="w-16 h-16" />,
      title: "Weekly Overview", 
      description: "Visual capacity planning with table, grid & carousel views",
      bgColor: "from-blue-600 to-blue-700"
    },
    {
      icon: <TrendingUp className="w-16 h-16" />,
      title: "Team Workload",
      description: "Complete team coordination",
      bgColor: "from-purple-500 to-purple-600"
    },
    {
      icon: <GanttChartSquare className="w-16 h-16" />,
      title: "Project Resourcing",
      description: "Strategic resource allocation",
      bgColor: "from-violet-600 to-violet-700"
    },
    {
      icon: <Calendar className="w-16 h-16" />,
      title: "Annual Leave",
      description: "Smart vacation planning",
      bgColor: "from-blue-500 to-blue-600"
    },
    {
      icon: <FolderKanban className="w-16 h-16" />,
      title: "All Projects",
      description: "Complete project overview",
      bgColor: "from-indigo-600 to-indigo-700"
    },
    {
      icon: <User className="w-16 h-16" />,
      title: "Member Profile",
      description: "View your own or others' profiles",
      bgColor: "from-fuchsia-600 to-fuchsia-700"
    },
    {
      icon: <Flag className="w-16 h-16" />,
      title: "Office Settings",
      description: "Complete workspace control",
      bgColor: "from-purple-700 to-purple-800"
    }
  ];

  // Show only first 3 features on main page
  const displayFeatures = isMainPage ? appFeatures.slice(0, 3) : appFeatures;

  const handleLaunchDemo = () => {
    startDemoMode();
    navigate('/demo/dashboard');
  };

  return (
    <div id="app-tour" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="cascadeUp" delay={0}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {isMainPage ? 'Explore the Platform' : 'Interactive Demo Available'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isMainPage 
                ? 'Discover all the powerful features and pages that make resource management effortless and efficient for your team.'
                : 'Experience the full platform with live demo data. Explore all features, navigate through pages, and see how it works for real teams.'
              }
            </p>
          </div>
        </AnimatedSection>

        <div className={`grid gap-8 ${isMainPage ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-4'}`}>
          {displayFeatures.map((feature, index) => (
            <AnimatedSection key={index} animation="cascadeScale" delay={200 + index * 150}>
              <div className="group text-center">
                <div className={`relative mb-4 mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br ${feature.bgColor} flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                  <div className="relative text-white transition-colors">
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

        <AnimatedSection animation="cascadeUp" delay={800}>
          <div className="text-center mt-16">
            {isMainPage ? (
              <Link 
                to="/app-tour"
                className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg inline-block"
              >
                Explore More Features →
              </Link>
            ) : (
              <>
                <button 
                  onClick={handleLaunchDemo}
                  className="bg-gradient-to-r from-[#895CF7] via-[#5669F7] to-[#E64FC4] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg mr-4 inline-flex items-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Launch Interactive Demo
                </button>
                <Link 
                  to="/screenshots"
                  className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors inline-block"
                >
                  View Screenshots
                </Link>
              </>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default AppTour;