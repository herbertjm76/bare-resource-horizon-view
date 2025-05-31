
import React from 'react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FloatingIcons, GradientOrbs, StatsVisualization } from '@/components/common/VisualElements';
import { Brain, Users, TrendingUp, Zap, Sparkles, PlayCircle } from 'lucide-react';

const Hero = () => {
  const { elementRef: floatingRef, isVisible: floatingVisible } = useScrollAnimation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const heroStats = [
    { value: "95%", label: "Time Saved", icon: Zap },
    { value: "10x", label: "Faster Planning", icon: TrendingUp },
    { value: "100%", label: "AI Accuracy", icon: Brain },
    { value: "24/7", label: "Smart Alerts", icon: Sparkles }
  ];

  return (
    <div className="relative pt-20 bg-gradient-to-br from-[#6E59A5] via-[#895CF7] to-[#E64FC4] overflow-hidden min-h-screen">
      {/* Enhanced Background with floating icons and orbs */}
      <GradientOrbs />
      <FloatingIcons />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Hero Text with Visual Enhancements */}
          <div className="space-y-8">
            <div className="space-y-6">
              <AnimatedSection animation="fadeInUp" delay={200}>
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white text-sm font-medium transition-all duration-300 hover:bg-white/30 hover:scale-105">
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  🧠 AI-Powered Team Management
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={400}>
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Smart Team
                  <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-[pulse_3s_ease-in-out_infinite]">
                      Planning
                    </span>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-[float_4s_ease-in-out_infinite]">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <span className="block">for Design Studios</span>
                </h1>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={600}>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <p className="text-xl text-white/90 leading-relaxed mb-4">
                    Stop wondering when to hire. Get AI alerts that tell you exactly when your team needs help.
                  </p>
                  
                  {/* Visual AI Examples */}
                  <div className="space-y-3">
                    {[
                      { icon: Users, text: "Hire 1 designer by March", color: "green" },
                      { icon: TrendingUp, text: "Prospect 2 new clients", color: "blue" },
                      { icon: Brain, text: "Team at 95% - burnout risk", color: "orange" }
                    ].map((item, index) => (
                      <div key={index} className={`flex items-center gap-3 opacity-0 animate-[fadeInLeft_0.6s_ease-out_forwards] animation-delay-${800 + (index * 200)}`}>
                        <div className={`w-8 h-8 bg-${item.color}-400 rounded-lg flex items-center justify-center animate-pulse`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-white/95">"{item.text}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
            
            {/* CTA Buttons with Icons */}
            <AnimatedSection animation="fadeInUp" delay={1000}>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('signup')}
                  className="group bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                >
                  <Brain className="w-5 h-5 group-hover:animate-pulse" />
                  Get AI Team Insights Free
                  <Sparkles className="w-4 h-4 group-hover:animate-bounce" />
                </button>
                <button className="group bg-white/15 backdrop-blur-sm text-white px-8 py-4 rounded-2xl border border-white/30 hover:bg-white/25 transition-all duration-300 font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:-translate-y-1">
                  <PlayCircle className="w-5 h-5 group-hover:scale-110" />
                  See AI in Action
                </button>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Enhanced Hero Visual */}
          <AnimatedSection animation="fadeInRight" delay={600}>
            <div className="relative flex justify-center">
              {/* Floating dashboard with enhanced visuals */}
              <div className="relative">
                {/* Multiple floating AI insight cards */}
                <div 
                  ref={floatingRef}
                  className={`absolute -top-8 -left-8 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl z-10 transition-all duration-700 ${
                    floatingVisible ? 'opacity-100 translate-y-0 animate-[float_4s_ease-in-out_infinite]' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-800 mb-1">🎯 AI Recommendation</div>
                      <div className="text-lg font-bold text-green-600">Hire 1 Designer</div>
                      <div className="text-xs text-gray-600">by March 15th</div>
                    </div>
                  </div>
                </div>
                
                <div className={`absolute -bottom-6 -right-8 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl z-10 transition-all duration-700 delay-300 ${
                  floatingVisible ? 'opacity-100 translate-y-0 animate-[float_5s_ease-in-out_infinite] animation-delay-1000' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center animate-[pulse_2.5s_ease-in-out_infinite]">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-800 mb-1">📈 Pipeline Alert</div>
                      <div className="text-lg font-bold text-blue-600">Need 2 Clients</div>
                      <div className="text-xs text-gray-600">this quarter</div>
                    </div>
                  </div>
                </div>

                <div className={`absolute top-16 -right-4 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-2xl z-10 transition-all duration-700 delay-500 ${
                  floatingVisible ? 'opacity-100 translate-y-0 animate-[float_6s_ease-in-out_infinite] animation-delay-2000' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-orange-600">⚠️ 95% Capacity</div>
                    </div>
                  </div>
                </div>
                
                {/* Main dashboard with enhanced styling */}
                <div className="bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 transition-all duration-500 hover:bg-white/25 hover:shadow-3xl hover:scale-105 hover:-translate-y-2">
                  <img 
                    src="/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png" 
                    alt="BareResource Dashboard with AI Insights" 
                    className="w-full rounded-2xl shadow-2xl max-w-md mx-auto transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Stats Section */}
        <AnimatedSection animation="fadeInUp" delay={1200}>
          <div className="mt-20 pt-12 border-t border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white/90 mb-2">Trusted by Design Teams Worldwide</h3>
              <p className="text-white/70">Join studios already using AI for smarter team planning</p>
            </div>
            <StatsVisualization stats={heroStats} />
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Hero;
