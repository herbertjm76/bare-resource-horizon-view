
import { Users, Calendar, ChartBar, FileSpreadsheet, Zap, Shield, Target, Clock, Brain, TrendingUp, Sparkles } from 'lucide-react';
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
  <VisualCard className={`group transition-all duration-500 ${
    highlight 
      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-105' 
      : 'bg-white'
  } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
  style={{ transitionDelay: `${index * 150}ms` }}
  >
    {premium && (
      <div className="absolute -top-3 -right-3 animate-[bounce_2s_ease-in-out_infinite]">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-lg">
          <Brain className="w-3 h-3 animate-pulse" />
          AI
        </div>
      </div>
    )}
    
    {/* Visual background pattern */}
    <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-2xl"></div>
    </div>
    
    <div className="relative">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 ${
        highlight 
          ? 'bg-white/20 backdrop-blur-sm' 
          : 'bg-gradient-to-br from-purple-100 to-blue-100'
      }`}>
        <div className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
      
      <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
        highlight ? 'text-white' : 'text-gray-900 group-hover:text-purple-600'
      }`}>
        {title}
      </h3>
      
      <p className={`leading-relaxed transition-colors duration-300 ${
        highlight ? 'text-white/90' : 'text-gray-600 group-hover:text-gray-700'
      }`}>
        {description}
      </p>
      
      {/* Progress indicator for visual appeal */}
      <div className="mt-4 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((dot, i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < 4 ? (highlight ? 'bg-white/60' : 'bg-purple-400') : (highlight ? 'bg-white/20' : 'bg-gray-200')
            }`}
          />
        ))}
      </div>
    </div>
  </VisualCard>
);

const Features = () => {
  const { elementRef: featuresRef, visibleItems } = useStaggeredAnimation(6, 150);

  const features = [
    {
      icon: <Brain className="w-10 h-10 text-purple-600" />,
      title: "AI Business Insights",
      description: "Get instant alerts when your team needs expansion or when utilization drops below optimal levels.",
      highlight: true,
      premium: true
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-purple-600" />,
      title: "Smart Hiring Alerts",
      description: "AI analyzes trends and tells you exactly when your team needs expansion.",
      premium: true
    },
    {
      icon: <Target className="w-10 h-10 text-purple-600" />,
      title: "Pipeline Intelligence",
      description: "Get early warnings when you need more projects in the pipeline.",
      premium: true
    },
    {
      icon: <FileSpreadsheet className="w-10 h-10 text-purple-600" />,
      title: "Visual Resource Grid",
      description: "See your entire team's workload at a glance with intuitive visual planning."
    },
    {
      icon: <Calendar className="w-10 h-10 text-purple-600" />,
      title: "Smart Scheduling",
      description: "Drag and drop to allocate people to projects with conflict detection."
    },
    {
      icon: <ChartBar className="w-10 h-10 text-purple-600" />,
      title: "Instant Reports",
      description: "Get utilization insights in seconds, not hours of spreadsheet work."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <GradientOrbs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Visual Header */}
        <AnimatedSection animation="fadeInUp" className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm mb-2 transition-all duration-300 hover:bg-purple-200 hover:scale-105">
                  AI-Powered Excel Replacement
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Excel + AI Intelligence
                </h2>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite] animation-delay-500">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The familiar resource planning you know, enhanced with AI that guides your business decisions.
          </p>
        </AnimatedSection>
        
        <IconSeparator icon={Zap} color="purple" />
        
        {/* Enhanced Features Grid */}
        <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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

        <IconSeparator icon={Brain} color="blue" />

        {/* Enhanced AI Showcase */}
        <AnimatedSection animation="scaleIn" delay={400}>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-12 border border-purple-100 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105">
            <GradientOrbs />
            
            <div className="relative text-center">
              {/* Visual AI Badge */}
              <div className="flex items-center justify-center mb-8">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-110 animate-[pulse_3s_ease-in-out_infinite]">
                  <Brain className="w-6 h-6 mr-3 animate-bounce" />
                  Premium AI Features
                  <Sparkles className="w-5 h-5 ml-3 animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-4xl font-bold text-gray-900 mb-8">
                Your Studio's Smart Business Advisor
              </h3>
              
              {/* Enhanced AI Example Box */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl border border-white/50 transition-all duration-500 hover:bg-white hover:shadow-3xl">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center animate-pulse">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <p className="text-xl text-gray-700 italic mb-8 leading-relaxed font-medium">
                  "Based on your current utilization and project pipeline, I recommend hiring 2 designers within 60 days. 
                  Your team is trending toward 95% capacity, which historically leads to quality issues."
                </p>
                
                {/* Visual indicators */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { color: 'bg-green-500', label: 'Hiring Alerts', icon: Users },
                    { color: 'bg-blue-500', label: 'Pipeline Warnings', icon: TrendingUp },
                    { color: 'bg-purple-500', label: 'Capacity Optimization', icon: Target },
                    { color: 'bg-orange-500', label: 'Burnout Prevention', icon: Shield }
                  ].map((item, index) => (
                    <div key={index} className="text-center group">
                      <div className={`w-12 h-12 ${item.color} rounded-2xl mx-auto mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:rotate-12`}>
                        <item.icon className="w-6 h-6 text-white" />
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
