
import { CheckCircle, Target, Zap, AlertTriangle, Brain, TrendingUp, Users, ArrowRight, Lightbulb, Shield, Sparkles, Clock } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { VisualCard, IconSeparator, GradientOrbs, StatsVisualization } from '@/components/common/VisualElements';

const Benefits = () => {
  const { elementRef: benefitsRef, visibleItems } = useStaggeredAnimation(4, 150);

  const benefits = [
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI Hiring Alerts",
      description: "Know when to expand your team",
      example: "Need to hire more designers",
      color: "from-purple-500 to-blue-500",
      premium: true,
      stats: "Real-time"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: "Pipeline Intelligence", 
      description: "Early warnings on project capacity",
      example: "Need more projects in pipeline",
      color: "from-blue-500 to-cyan-500",
      premium: true,
      stats: "Predictive"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Burnout Prevention",
      description: "Prevent team overload",
      example: "Team approaching max capacity",
      color: "from-green-500 to-emerald-500",
      stats: "Proactive"
    },
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      title: "Smart Capacity Planning",
      description: "Optimize resource allocation",
      example: "Available capacity this week",
      color: "from-orange-500 to-red-500",
      stats: "Live data"
    }
  ];

  const comparisonStats = [
    { value: "5hrs", label: "Weekly Planning", icon: Clock },
    { value: "0", label: "Hiring Mistakes", icon: CheckCircle },
    { value: "10x", label: "Faster Insights", icon: Zap },
    { value: "24/7", label: "AI Monitoring", icon: Brain }
  ];

  return (
    <div id="benefits" className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <GradientOrbs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection animation="fadeInUp" className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center animate-pulse">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <div className="inline-flex items-center px-3 py-1 bg-red-100 rounded-full text-red-600 font-semibold text-sm mb-1">
                Stop Flying Blind
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Get AI-Powered Insights
              </h2>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Excel tells you what happened. BareResource's AI tells you what to do next.
          </p>
        </AnimatedSection>
        
        <div ref={benefitsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`group relative transition-all duration-500 ${
                visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <VisualCard className="h-full group-hover:scale-105 p-4">
                {benefit.premium && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-1 rounded-full font-bold text-xs flex items-center gap-1">
                      <Brain className="w-3 h-3" />
                      AI
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300`}>
                    <div className="text-white">
                      {benefit.icon}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold">
                      {benefit.stats}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {benefit.description}
                  </p>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-2 border-l-2 border-purple-500">
                    <p className="text-xs font-medium text-gray-700 italic">
                      "{benefit.example}"
                    </p>
                  </div>
                </div>
              </VisualCard>
            </div>
          ))}
        </div>

        <AnimatedSection animation="scaleIn" delay={400}>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
            <GradientOrbs />
            
            <div className="relative">
              <div className="text-center mb-6">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  From Reactive to Proactive
                </h3>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-6 items-center">
                <AnimatedSection animation="fadeInLeft" delay={200}>
                  <VisualCard className="border-red-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900">With Excel</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        "We're overwhelmed!"
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        "Why did we lose that client?"
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        "Is the team burning out?"
                      </li>
                    </ul>
                  </VisualCard>
                </AnimatedSection>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-purple-600 animate-pulse" />
                </div>

                <AnimatedSection animation="fadeInRight" delay={400}>
                  <VisualCard className="border-green-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900">With BareResource AI</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        "Need to hire more designers"
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        "Need more projects in pipeline"
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        "Team at high capacity"
                      </li>
                    </ul>
                  </VisualCard>
                </AnimatedSection>
              </div>
              
              <div className="mt-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">The Numbers Don't Lie</h4>
                <StatsVisualization stats={comparisonStats} />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Benefits;
