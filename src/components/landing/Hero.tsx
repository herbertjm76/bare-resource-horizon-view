
import React from 'react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { GradientOrbs } from '@/components/common/VisualElements';
import { BarChart3, TrendingUp, Zap, PlayCircle } from 'lucide-react';

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
    { value: "100%", label: "Team Visibility", icon: BarChart3 }
  ];

  return (
    <div className="relative pt-20 bg-gradient-to-br from-[#6E59A5] via-[#895CF7] to-[#E64FC4] overflow-hidden min-h-screen">
      <GradientOrbs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Hero Text */}
          <div className="space-y-8">
            <div className="space-y-6">
              <AnimatedSection animation="fadeInUp" delay={200}>
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white text-sm font-medium transition-all duration-300 hover:bg-white/30 hover:scale-105 cursor-pointer group">
                  <BarChart3 className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  Smart Team Management
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={400}>
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  <span className="inline-block transition-transform duration-500 hover:scale-105">Smart Team</span>
                  <div className="flex items-center gap-4">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent inline-block transition-all duration-500 hover:scale-110 hover:rotate-1 cursor-default">
                      Planning
                    </span>
                  </div>
                  <span className="block transition-transform duration-500 hover:scale-105">for Design Studios</span>
                </h1>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={600}>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:shadow-2xl group cursor-pointer">
                  <p className="text-xl text-white/90 leading-relaxed transition-colors duration-300 group-hover:text-white">
                    Replace spreadsheet chaos with visual resource planning. Get insights that tell you exactly when your team needs help.
                  </p>
                </div>
              </AnimatedSection>
            </div>
            
            {/* CTA Buttons */}
            <AnimatedSection animation="fadeInUp" delay={1000}>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('signup')}
                  className="group bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold hover:bg-purple-50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl relative overflow-hidden"
                >
                  <span className="relative z-10">Get Smart Team Insights Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                </button>
                <button className="group bg-white/15 backdrop-blur-sm text-white px-8 py-4 rounded-2xl border border-white/30 hover:bg-white/25 transition-all duration-500 font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:-translate-y-1 hover:shadow-xl">
                  <PlayCircle className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  See Dashboard Demo
                </button>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Enhanced Hero Visual */}
          <AnimatedSection animation="fadeInRight" delay={600}>
            <div className="relative flex justify-center">
              <div className="relative group">
                {/* Insight cards showing actual dashboard features */}
                <div 
                  ref={floatingRef}
                  className={`absolute -top-8 -left-8 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl z-10 transition-all duration-700 cursor-pointer hover:scale-110 hover:rotate-2 ${
                    floatingVisible ? 'opacity-100 translate-y-0 animate-[float_4s_ease-in-out_infinite]' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center transition-transform duration-300 hover:rotate-12">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600 transition-colors duration-300 hover:text-green-700">85% Utilization</div>
                      <div className="text-xs text-gray-600">Team capacity alert</div>
                    </div>
                  </div>
                </div>
                
                <div className={`absolute -bottom-6 -right-8 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl z-10 transition-all duration-700 delay-300 cursor-pointer hover:scale-110 hover:-rotate-2 ${
                  floatingVisible ? 'opacity-100 translate-y-0 animate-[float_5s_ease-in-out_infinite] animation-delay-1000' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center transition-transform duration-300 hover:rotate-12">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600 transition-colors duration-300 hover:text-blue-700">Q2 Pipeline Low</div>
                      <div className="text-xs text-gray-600">Project capacity warning</div>
                    </div>
                  </div>
                </div>

                <div className={`absolute top-16 -right-4 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-2xl z-10 transition-all duration-700 delay-500 cursor-pointer hover:scale-110 hover:rotate-1 ${
                  floatingVisible ? 'opacity-100 translate-y-0 animate-[float_6s_ease-in-out_infinite] animation-delay-2000' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center transition-transform duration-300 hover:pulse">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-orange-600 transition-colors duration-300 hover:text-orange-700">Workload Alert</div>
                    </div>
                  </div>
                </div>
                
                {/* Main dashboard */}
                <div className="bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 transition-all duration-700 hover:scale-105 hover:shadow-3xl group-hover:bg-white/25">
                  <img 
                    src="/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png" 
                    alt="BareResource Dashboard with Smart Insights" 
                    className="w-full rounded-2xl shadow-2xl max-w-md mx-auto transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Stats Section - Enhanced with micro-animations */}
        <AnimatedSection animation="fadeInUp" delay={1200}>
          <div className="mt-20 pt-12 border-t border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white/90 mb-2 transition-colors duration-300 hover:text-white">Trusted by Design Teams Worldwide</h3>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              {heroStats.map((stat, index) => (
                <div key={index} className="group cursor-pointer transition-all duration-500 hover:scale-110">
                  <div className="text-2xl font-bold text-white mb-1 transition-all duration-300 group-hover:scale-110 group-hover:text-yellow-300">{stat.value}</div>
                  <div className="text-sm text-white/70 transition-colors duration-300 group-hover:text-white/90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Hero;
