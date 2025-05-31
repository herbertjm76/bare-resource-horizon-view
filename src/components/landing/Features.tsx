
import { Users, Calendar, ChartBar, FileSpreadsheet, Zap, Brain, TrendingUp, Sparkles } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { VisualCard, IconSeparator, GradientOrbs } from '@/components/common/VisualElements';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
  premium?: boolean;
  index: number;
  isVisible: boolean;
}

const FeatureCard = ({ icon, title, description, highlight, premium, index, isVisible }: FeatureCardProps) => (
  <VisualCard 
    className={`group transition-all duration-500 ${
      highlight 
        ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-105' 
        : 'bg-white'
    } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} p-4`}
    style={{ transitionDelay: `${index * 150}ms` }}
  >
    {premium && (
      <div className="absolute -top-2 -right-2">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-1 rounded-full font-bold text-xs flex items-center gap-1">
          <Brain className="w-3 h-3" />
          AI
        </div>
      </div>
    )}
    
    <div className="relative">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 ${
        highlight 
          ? 'bg-white/20 backdrop-blur-sm' 
          : 'bg-gradient-to-br from-purple-100 to-blue-100'
      }`}>
        <div className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
      
      <h3 className={`text-lg font-bold mb-3 ${
        highlight ? 'text-white' : 'text-gray-900 group-hover:text-purple-600'
      }`}>
        {title}
      </h3>
      
      <p className={`leading-relaxed text-sm ${
        highlight ? 'text-white/90' : 'text-gray-600'
      }`}>
        {description}
      </p>
    </div>
  </VisualCard>
);

const Features = () => {
  const { elementRef: featuresRef, visibleItems } = useStaggeredAnimation(6, 150);

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI Business Insights",
      description: "Get alerts when your team needs expansion or when utilization drops below optimal levels.",
      highlight: true,
      premium: true
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Smart Hiring Alerts",
      description: "AI analyzes trends and tells you when your team needs expansion.",
      premium: true
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Pipeline Intelligence",
      description: "Get early warnings when you need more projects.",
      premium: true
    },
    {
      icon: <FileSpreadsheet className="w-8 h-8 text-purple-600" />,
      title: "Visual Resource Grid",
      description: "See your team's workload at a glance with intuitive planning."
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: "Smart Scheduling",
      description: "Drag and drop to allocate people to projects."
    },
    {
      icon: <ChartBar className="w-8 h-8 text-purple-600" />,
      title: "Instant Reports",
      description: "Get utilization insights in seconds, not hours."
    }
  ];

  return (
    <section id="features" className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <GradientOrbs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection animation="fadeInUp" className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="inline-flex items-center px-3 py-1 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm mb-1">
                AI-Powered Excel Replacement
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Excel + AI Intelligence
              </h2>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The familiar resource planning you know, enhanced with AI that guides your business decisions.
          </p>
        </AnimatedSection>
        
        <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              highlight={feature.highlight}
              premium={feature.premium}
              index={index}
              isVisible={visibleItems.includes(index)}
            />
          ))}
        </div>

        <AnimatedSection animation="scaleIn" delay={400}>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 lg:p-8 border border-purple-100 relative overflow-hidden">
            <GradientOrbs />
            
            <div className="relative text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-xl font-bold">
                  <Brain className="w-5 h-5 mr-2" />
                  Premium AI Features
                  <Sparkles className="w-4 h-4 ml-2" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Your Studio's Smart Business Advisor
              </h3>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto shadow-xl border border-white/50">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <p className="text-lg text-gray-700 italic mb-6 font-medium">
                  "Based on your current utilization and project pipeline, I recommend hiring more designers. 
                  Your team is trending toward high capacity, which may impact quality."
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { color: 'bg-green-500', label: 'Hiring Alerts', icon: Users },
                    { color: 'bg-blue-500', label: 'Pipeline Warnings', icon: TrendingUp },
                    { color: 'bg-purple-500', label: 'Capacity Optimization', icon: Users },
                    { color: 'bg-orange-500', label: 'Burnout Prevention', icon: Brain }
                  ].map((item, index) => (
                    <div key={index} className="text-center group">
                      <div className={`w-10 h-10 ${item.color} rounded-xl mx-auto mb-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Features;
