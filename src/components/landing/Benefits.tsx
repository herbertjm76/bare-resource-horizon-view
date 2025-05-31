import { CheckCircle, Target, Zap, AlertTriangle, Brain, TrendingUp, Users, Calendar, ArrowRight, Lightbulb, Shield, Sparkles, Clock } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { VisualCard, IconSeparator, GradientOrbs, StatsVisualization } from '@/components/common/VisualElements';

const Benefits = () => {
  const { elementRef: benefitsRef, visibleItems } = useStaggeredAnimation(4, 200);

  const benefits = [
    {
      icon: <Brain className="w-10 h-10 text-purple-600" />,
      title: "AI Hiring Alerts",
      description: "Get specific recommendations on when to expand your team",
      example: "Hire 1 senior designer by March",
      color: "from-purple-500 to-blue-500",
      premium: true,
      stats: "95% accuracy"
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-blue-600" />,
      title: "Pipeline Intelligence", 
      description: "Early warnings when you need more projects",
      example: "Prospect 3 new clients now",
      color: "from-blue-500 to-cyan-500",
      premium: true,
      stats: "2 months early"
    },
    {
      icon: <Shield className="w-10 h-10 text-green-600" />,
      title: "Burnout Prevention",
      description: "Prevent team overload before it happens",
      example: "Team at 95% capacity risk",
      color: "from-green-500 to-emerald-500",
      stats: "100% prevention"
    },
    {
      icon: <Target className="w-10 h-10 text-orange-600" />,
      title: "Smart Capacity Planning",
      description: "Know exactly how much work you can take on",
      example: "32 hours available this week",
      color: "from-orange-500 to-red-500",
      stats: "Real-time"
    }
  ];

  const comparisonStats = [
    { value: "5hrs", label: "Weekly Planning", icon: Clock },
    { value: "0", label: "Hiring Mistakes", icon: CheckCircle },
    { value: "10x", label: "Faster Insights", icon: Zap },
    { value: "24/7", label: "AI Monitoring", icon: Brain }
  ];

  return (
    <div id="benefits" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <GradientOrbs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <AnimatedSection animation="fadeInUp" className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                <Lightbulb className="w-8 h-8 text-white animate-bounce" />
              </div>
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full text-red-600 font-semibold text-sm mb-2 transition-all duration-300 hover:bg-red-200 hover:scale-105">
                  Stop Flying Blind
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Get AI-Powered Insights
                </h2>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite] animation-delay-500">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Excel tells you what happened. BareResource's AI tells you what to do next.
          </p>
        </AnimatedSection>
        
        <IconSeparator icon={Brain} color="red" />
        
        {/* Enhanced Benefits Grid */}
        <div ref={benefitsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className={`group relative transition-all duration-500 ${
                visibleItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <VisualCard className="h-full group-hover:scale-105">
                {benefit.premium && (
                  <div className="absolute -top-3 -right-3 animate-[bounce_2s_ease-in-out_infinite]">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-lg">
                      <Brain className="w-3 h-3 animate-pulse" />
                      AI
                    </div>
                  </div>
                )}
                
                {/* Visual background */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                  <div className={`w-full h-full bg-gradient-to-br ${benefit.color} rounded-full blur-xl`}></div>
                </div>
                
                <div className="relative">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
                    <div className="text-white transition-transform duration-300 group-hover:scale-110">
                      {benefit.icon}
                    </div>
                  </div>
                  
                  {/* Stats badge */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold">
                      {benefit.stats}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {benefit.description}
                  </p>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3 border-l-4 border-purple-500 group-hover:bg-purple-50 transition-colors duration-300">
                    <p className="text-xs font-medium text-gray-700 italic">
                      "{benefit.example}"
                    </p>
                  </div>
                </div>
              </VisualCard>
            </div>
          ))}
        </div>

        <IconSeparator icon={ArrowRight} color="green" />

        {/* Enhanced Visual Comparison */}
        <AnimatedSection animation="scaleIn" delay={600}>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 lg:p-12 relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
            <GradientOrbs />
            
            <div className="relative">
              <div className="text-center mb-8">
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  From Reactive to Proactive
                </h3>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* Before */}
                <AnimatedSection animation="fadeInLeft" delay={200}>
                  <VisualCard className="border-red-200 hover:shadow-lg hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center animate-pulse">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">With Excel</h4>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-center gap-2 transition-all duration-300 hover:text-red-600">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        "We're overwhelmed, need help now!"
                      </li>
                      <li className="flex items-center gap-2 transition-all duration-300 hover:text-red-600">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        "Why did we lose that client?"
                      </li>
                      <li className="flex items-center gap-2 transition-all duration-300 hover:text-red-600">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        "Is Sarah about to burn out?"
                      </li>
                    </ul>
                  </VisualCard>
                </AnimatedSection>

                {/* Arrow with visual enhancement */}
                <div className="flex justify-center lg:justify-center">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-8 h-8 text-purple-600 animate-[pulse_2s_ease-in-out_infinite]" />
                    <div className="flex flex-col gap-1">
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce animation-delay-400"></div>
                    </div>
                  </div>
                </div>

                {/* After */}
                <AnimatedSection animation="fadeInRight" delay={400}>
                  <VisualCard className="border-green-200 hover:shadow-lg hover:scale-105">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center animate-pulse">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">With BareResource AI</h4>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-center gap-2 transition-all duration-300 hover:text-green-600">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        "Hire 1 designer by March 15th"
                      </li>
                      <li className="flex items-center gap-2 transition-all duration-300 hover:text-green-600">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-200"></div>
                        "Prospect 2 clients this week"
                      </li>
                      <li className="flex items-center gap-2 transition-all duration-300 hover:text-green-600">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse animation-delay-400"></div>
                        "Sarah at 95% - assign backup"
                      </li>
                    </ul>
                  </VisualCard>
                </AnimatedSection>
              </div>
              
              {/* Stats visualization */}
              <div className="mt-12">
                <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">The Numbers Don't Lie</h4>
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
