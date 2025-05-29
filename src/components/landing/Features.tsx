
import { Users, Calendar, ChartBar, FileSpreadsheet, Zap, Shield, Target, Clock } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}

const FeatureCard = ({ icon, title, description, highlight }: FeatureCardProps) => (
  <div className={`group relative p-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
    highlight 
      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' 
      : 'bg-white shadow-lg hover:shadow-xl border border-gray-100'
  }`}>
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
      icon: <FileSpreadsheet className="w-6 h-6 text-purple-600" />,
      title: "Visual Resource Grid",
      description: "See your entire team's workload at a glance. No more scrolling through endless spreadsheet rows.",
      highlight: true
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      title: "Real-Time Collaboration",
      description: "Everyone sees the same data instantly. No more 'wait, which version are we using?'"
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
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      title: "Quick Setup",
      description: "Import your team and projects in minutes. Start planning today, not next week."
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "Never Lose Data",
      description: "Automatic backups and version history. Your planning data is always safe and recoverable."
    }
  ];

  return (
    <div id="features" className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm mb-4">
            🚀 Everything Excel Can't Do
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Built for Design Teams Who Outgrew Spreadsheets
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stop fighting with formulas and start focusing on what matters: delivering great work on time and on budget.
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
