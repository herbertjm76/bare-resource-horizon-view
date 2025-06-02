
import React from 'react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { GradientOrbs } from '@/components/common/VisualElements';
import { PlayCircle, Calendar, TrendingDown, Shield } from 'lucide-react';

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

  return (
    <div className="relative pt-20 bg-gradient-to-br from-[#6E59A5] via-[#895CF7] to-[#E64FC4] overflow-hidden min-h-screen">
      <GradientOrbs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Hero Text */}
          <div className="space-y-8">
            <div className="space-y-6">
              <AnimatedSection animation="fadeInUp" delay={200}>
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white text-sm font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  For Design Studios
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={400}>
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Resource Planning Software for Design Studios
                </h1>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={600}>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <ul className="space-y-3 text-xl text-white/90">
                    <li className="flex items-start">
                      <span className="text-green-300 mr-3">•</span>
                      Know who's free next month
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-300 mr-3">•</span>
                      Track fee burn in real time
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-300 mr-3">•</span>
                      Stop overbooking before it hurts
                    </li>
                  </ul>
                </div>
              </AnimatedSection>
            </div>
            
            {/* CTA Buttons */}
            <AnimatedSection animation="fadeInUp" delay={1000}>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('signup')}
                  className="group bg-white text-purple-600 px-8 py-4 rounded-2xl font-semibold hover:bg-purple-50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl text-lg"
                >
                  Start 14-Day Trial
                </button>
                <button className="group bg-white/15 backdrop-blur-sm text-white px-8 py-4 rounded-2xl border border-white/30 hover:bg-white/25 transition-all duration-500 font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:-translate-y-1 hover:shadow-xl">
                  <PlayCircle className="w-5 h-5" />
                  Watch 90-sec Demo
                </button>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Enhanced Visual */}
          <AnimatedSection animation="fadeInRight" delay={600}>
            <div className="relative flex justify-center">
              <div className="relative group">
                {/* Capacity indicators showing real dashboard features */}
                <div 
                  ref={floatingRef}
                  className={`absolute -top-8 -left-8 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl z-10 transition-all duration-700 cursor-pointer hover:scale-110 hover:rotate-2 ${
                    floatingVisible ? 'opacity-100 translate-y-0 animate-[float_4s_ease-in-out_infinite]' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-600">110% Capacity</div>
                      <div className="text-xs text-gray-600">Sarah overbooked</div>
                    </div>
                  </div>
                </div>
                
                <div className={`absolute -bottom-6 -right-8 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl z-10 transition-all duration-700 delay-300 cursor-pointer hover:scale-110 hover:-rotate-2 ${
                  floatingVisible ? 'opacity-100 translate-y-0 animate-[float_5s_ease-in-out_infinite] animation-delay-1000' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-bold">75%</span>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">Fee Burn Alert</div>
                      <div className="text-xs text-gray-600">Project Alpha warning</div>
                    </div>
                  </div>
                </div>

                <div className={`absolute top-16 -right-4 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-2xl z-10 transition-all duration-700 delay-500 cursor-pointer hover:scale-110 hover:rotate-1 ${
                  floatingVisible ? 'opacity-100 translate-y-0 animate-[float_6s_ease-in-out_infinite] animation-delay-2000' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-green-600">3 Weeks Free</div>
                    </div>
                  </div>
                </div>
                
                {/* Main dashboard */}
                <div className="bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30 transition-all duration-700 hover:scale-105 hover:shadow-3xl group-hover:bg-white/25">
                  <img 
                    src="/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png" 
                    alt="Rolling Availability Calendar and Burn Meter Dashboard" 
                    className="w-full rounded-2xl shadow-2xl max-w-md mx-auto transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default Hero;
