
import React from 'react';
import { BarChart3, Users, Calendar, DollarSign, FileText, TrendingUp, User, Flag } from 'lucide-react';

const AppTour = () => {
  const features = [
    {
      icon: <BarChart3 className="w-16 h-16" />,
      title: "Project Management",
      description: "Track projects, stages, and budgets effortlessly",
      bgColor: "from-purple-600 to-purple-700"
    },
    {
      icon: <Users className="w-16 h-16" />,
      title: "Team Management",
      description: "Manage your team members and their roles",
      bgColor: "from-blue-600 to-blue-700"
    },
    {
      icon: <Calendar className="w-16 h-16" />,
      title: "Resource Planning",
      description: "Allocate resources and plan capacity",
      bgColor: "from-purple-500 to-purple-600"
    },
    {
      icon: <DollarSign className="w-16 h-16" />,
      title: "Financial Tracking",
      description: "Monitor budgets, costs, and profitability",
      bgColor: "from-blue-500 to-blue-600"
    },
    {
      icon: <FileText className="w-16 h-16" />,
      title: "Reporting",
      description: "Generate comprehensive project reports",
      bgColor: "from-purple-700 to-purple-800"
    },
    {
      icon: <TrendingUp className="w-16 h-16" />,
      title: "Analytics",
      description: "Gain insights with detailed analytics",
      bgColor: "from-blue-700 to-blue-800"
    },
    {
      icon: <User className="w-16 h-16" />,
      title: "Member Profile",
      description: "View your own or others' profiles",
      bgColor: "from-gray-900 to-black"
    },
    {
      icon: <Flag className="w-16 h-16" />,
      title: "Milestones",
      description: "Track important project milestones",
      bgColor: "from-purple-800 to-purple-900"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your project management with our comprehensive suite of tools designed for modern teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`bg-gradient-to-br ${feature.bgColor} p-8 text-white h-full flex flex-col items-center text-center`}>
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{feature.description}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppTour;
