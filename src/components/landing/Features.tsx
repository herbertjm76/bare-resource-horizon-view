
import { Users, Calendar, ChartBar, FileSpreadsheet, Zap, Shield, Target, Clock, Brain, TrendingUp } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
  premium?: boolean;
}

const FeatureCard = ({ icon, title, description, highlight, premium }: FeatureCardProps) => (
  <div className={`group relative p-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
    highlight 
      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' 
      : 'bg-white shadow-lg hover:shadow-xl border border-gray-100'
  }`}>
    {premium && (
      <div className="absolute -top-2 -right-2">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-1 rounded-full font-bold text-xs flex items-center gap-1">
          <Brain className="w-3 h-3" />
          AI
        </div>
      </div>
    )}
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
      highlight 
        ? 'bg-white/20 backdrop-blur-sm' 
        : 'bg-gradient-to-br from-purple-100 to-blue-100'
    }`}>
      {icon}
    </div>
    <h3 className={`text-xl font-bold mb-3 ${
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
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      title: "AI Business Insights",
      description: "Get instant alerts: 'Your team is 85% utilized - consider hiring' or 'Low utilization - time to prospect new clients.' Smart recommendations based on your actual data.",
      highlight: true,
      premium: true
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      title: "Know When to Hire",
      description: "AI analyzes utilization trends and tells you exactly when your team needs expansion. No more guesswork or scrambling to find talent.",
      premium: true
    },
    {
      icon: <Target className="w-6 h-6 text-purple-600" />,
      title: "Pipeline Intelligence",
      description: "Get early warnings when you need more projects in the pipeline. AI spots the gaps before your cash flow feels it.",
      premium: true
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6 text-purple-600" />,
      title: "Visual Resource Grid",
      description: "See your entire team's workload at a glance. No more scrolling through endless spreadsheet rows."
    },
    {
      icon: <Calendar className="w-6 h-6 text-purple-600" />,
      title: "Smart Scheduling",
      description: "Drag and drop to allocate people to projects. See conflicts before they become problems."
    },
    {
      icon: <ChartBar className="w-6 h-6 text-purple-600" />,
      title: "Instant Reports",
      description: "Get utilization reports in seconds, not hours of Excel formula wrestling."
    }
  ];

  return (
    <div id="features" className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm mb-4">
            🧠 AI-Powered Excel Replacement
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Excel + AI Business Intelligence
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Not just a prettier spreadsheet. Get the familiar resource planning you know, 
            plus AI that tells you when to hire, when to find more projects, and how to optimize your team.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* AI Features Callout */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-full font-bold text-sm mb-4">
              <Brain className="w-4 h-4 mr-1" />
              Premium AI Features
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Your Studio's Smart Business Advisor
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6">
              "Based on your current utilization and project pipeline, I recommend hiring 2 designers within 60 days to handle incoming work. 
              Your team is trending toward 95% capacity, which historically leads to quality issues and deadline slips."
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Hiring recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Pipeline warnings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Capacity optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Burnout prevention</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
