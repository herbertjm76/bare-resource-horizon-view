
import { Users, Calendar, ChartBar, Bell, Zap, Shield, Target, Clock } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}

const FeatureCard = ({ icon, title, description, highlight }: FeatureCardProps) => (
  <div className={`group relative p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
    highlight 
      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' 
      : 'bg-white shadow-lg hover:shadow-xl border border-gray-100'
  }`}>
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
      highlight 
        ? 'bg-white/20 backdrop-blur-sm' 
        : 'bg-gradient-to-br from-purple-100 to-blue-100'
    }`}>
      {icon}
    </div>
    <h3 className={`text-2xl font-bold mb-4 ${
      highlight ? 'text-white' : 'text-gray-900'
    }`}>
      {title}
    </h3>
    <p className={`text-lg leading-relaxed ${
      highlight ? 'text-white/90' : 'text-gray-600'
    }`}>
      {description}
    </p>
    
    {/* Hover effect overlay */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </div>
);

const Features = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-purple-600" />,
      title: "AI-Powered Planning",
      description: "Intelligent resource allocation that learns from your projects and predicts optimal staffing patterns.",
      highlight: true
    },
    {
      icon: <ChartBar className="w-8 h-8 text-purple-600" />,
      title: "Real-Time Analytics",
      description: "Live capacity tracking, utilization metrics, and performance insights that drive better decisions."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Smart Team Management",
      description: "Automated workload balancing prevents burnout while maximizing productivity across your organization."
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: "Dynamic Scheduling",
      description: "Adaptive project timelines that automatically adjust for holidays, leave, and resource constraints."
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: "Predictive Insights",
      description: "Forecast project bottlenecks and resource conflicts weeks before they happen with ML-powered predictions."
    },
    {
      icon: <Bell className="w-8 h-8 text-purple-600" />,
      title: "Proactive Alerts",
      description: "Smart notifications for capacity issues, deadline risks, and optimization opportunities as they emerge."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Enterprise Security",
      description: "Bank-level security with role-based access, audit trails, and compliance-ready data protection."
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      title: "Time Intelligence",
      description: "Advanced time tracking with automatic productivity analysis and billable hour optimization."
    }
  ];

  return (
    <div id="features" className="bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm mb-6">
            🚀 Powerful Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Everything You Need to Scale Smart
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From AI-powered resource planning to real-time analytics, BareResource gives you the tools 
            to transform chaos into competitive advantage.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              highlight={feature.highlight}
            />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to 10x Your Resource Efficiency?</h3>
            <p className="text-xl mb-8 text-white/90">
              Join 500+ companies already using BareResource to optimize their operations
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
