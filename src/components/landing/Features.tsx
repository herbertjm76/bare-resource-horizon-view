
import { Users, Calendar, ChartBar, FileSpreadsheet, Zap, Shield, Target, Clock, Brain, TrendingUp, Sparkles } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
  premium?: boolean;
}

const FeatureCard = ({ icon, title, description, highlight, premium }: FeatureCardProps) => (
  <div className={`group relative p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
    highlight 
      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' 
      : 'bg-white shadow-lg hover:shadow-xl border border-gray-100'
  }`}>
    {premium && (
      <div className="absolute -top-3 -right-3">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-lg">
          <Brain className="w-3 h-3" />
          AI
        </div>
      </div>
    )}
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
      highlight 
        ? 'bg-white/20 backdrop-blur-sm' 
        : 'bg-gradient-to-br from-purple-100 to-blue-100'
    }`}>
      {icon}
    </div>
    <h3 className={`text-xl font-bold mb-4 ${
      highlight ? 'text-white' : 'text-gray-900'
    }`}>
      {title}
    </h3>
    <p className={`leading-relaxed ${
      highlight ? 'text-white/90' : 'text-gray-600'
    }`}>
      {description}
    </p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI Business Insights",
      description: "Get instant alerts when your team needs expansion or when utilization drops below optimal levels.",
      highlight: true,
      premium: true
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Smart Hiring Alerts",
      description: "AI analyzes trends and tells you exactly when your team needs expansion.",
      premium: true
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: "Pipeline Intelligence",
      description: "Get early warnings when you need more projects in the pipeline.",
      premium: true
    },
    {
      icon: <FileSpreadsheet className="w-8 h-8 text-purple-600" />,
      title: "Visual Resource Grid",
      description: "See your entire team's workload at a glance with intuitive visual planning."
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: "Smart Scheduling",
      description: "Drag and drop to allocate people to projects with conflict detection."
    },
    {
      icon: <ChartBar className="w-8 h-8 text-purple-600" />,
      title: "Instant Reports",
      description: "Get utilization insights in seconds, not hours of spreadsheet work."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with better spacing */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Excel Replacement
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Excel + AI Business Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The familiar resource planning you know, enhanced with AI that guides your business decisions.
          </p>
        </div>
        
        {/* Features Grid with improved spacing */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              highlight={feature.highlight}
              premium={feature.premium}
            />
          ))}
        </div>

        {/* AI Showcase - Visual storytelling */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-12 border border-purple-100 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
          
          <div className="relative text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-full font-bold text-sm mb-8">
              <Brain className="w-4 h-4 mr-2" />
              Premium AI Features
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Your Studio's Smart Business Advisor
            </h3>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto shadow-lg border border-white/50">
              <p className="text-lg text-gray-700 italic mb-8 leading-relaxed">
                "Based on your current utilization and project pipeline, I recommend hiring 2 designers within 60 days. 
                Your team is trending toward 95% capacity, which historically leads to quality issues."
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm font-medium text-gray-700">Hiring Alerts</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm font-medium text-gray-700">Pipeline Warnings</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm font-medium text-gray-700">Capacity Optimization</span>
                </div>
                <div className="text-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm font-medium text-gray-700">Burnout Prevention</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
