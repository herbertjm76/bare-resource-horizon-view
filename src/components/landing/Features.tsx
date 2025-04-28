
import { Users, Calendar, ChartBar, Bell } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Smart Project Planning",
      description: "Plan projects with confidence using AI-powered resource allocation insights.",
    },
    {
      icon: <ChartBar className="w-8 h-8 text-purple-500" />,
      title: "Resource Intelligence",
      description: "Make data-driven staffing decisions with real-time capacity analysis.",
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-500" />,
      title: "Team Management",
      description: "Optimize team workloads and prevent burnout with smart scheduling.",
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-500" />,
      title: "Project Tracking",
      description: "Monitor project progress and resource utilization in real-time.",
    },
    {
      icon: <ChartBar className="w-8 h-8 text-purple-500" />,
      title: "Performance Analytics",
      description: "Get detailed insights into project performance and team productivity.",
    },
    {
      icon: <Bell className="w-8 h-8 text-purple-500" />,
      title: "Proactive Alerts",
      description: "Stay ahead with early warnings for project risks and resource conflicts.",
    },
  ];

  return (
    <div className="bg-white py-24" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Project Management, Elevated</h2>
          <p className="text-xl text-gray-600">Everything you need to run successful projects with intelligent resource planning</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;

