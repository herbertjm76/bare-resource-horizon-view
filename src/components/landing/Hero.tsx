import React from 'react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { GradientOrbs } from '@/components/common/VisualElements';
import { PlayCircle, Calendar } from 'lucide-react';
import FloatingInsightCards from './FloatingInsightCards';
const Hero = () => {
  const {
    elementRef: floatingRef,
    isVisible: floatingVisible
  } = useScrollAnimation();
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  return <div className="
        relative 
        bg-gradient-to-br from-[#6E59A5] via-[#895CF7] to-[#E64FC4] 
        overflow-hidden
        min-h-[600px] sm:h-[700px] lg:h-[800px] 
        flex items-center
        pt-16 sm:pt-8
      ">
      <GradientOrbs />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Text Content - Full width on mobile, 4 cols on desktop */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5 text-center lg:text-left">
            <div className="space-y-3 sm:space-y-4">
              <AnimatedSection animation="fadeInUp" delay={200}>
                <div className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white text-xs font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  For Design Studios
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={400}>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                  Resource Planning Software for Design Studios
                </h1>
              </AnimatedSection>

              <AnimatedSection animation="fadeInUp" delay={500}>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Balance capacity. <span className="text-pink-300">Spot bottlenecks.</span> <span className="text-blue-300">Deliver on time.</span>
                  <br />
                  Visualize people & projects in one space—clarity for your whole team.
                </p>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={600}>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20 max-w-md mx-auto lg:mx-0">
                  <ul className="space-y-1 text-sm sm:text-base text-white/90">
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
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button onClick={() => scrollToSection('signup')} className="group bg-white text-purple-600 px-5 py-2.5 rounded-2xl font-semibold hover:bg-purple-50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl text-sm sm:text-base">
                  Start 14-Day Trial
                </button>
                <button className="group bg-white/15 backdrop-blur-sm text-white px-5 py-2.5 rounded-2xl border border-white/30 hover:bg-white/25 transition-all duration-500 font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:-translate-y-1 hover:shadow-xl text-sm sm:text-base">
                  <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Watch Demo
                </button>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Dashboard Image with Floating Cards - Hidden on mobile, visible on tablet+ */}
          <div className="hidden sm:block lg:col-span-8 relative">
            <AnimatedSection animation="fadeInRight" delay={600}>
              <div ref={floatingRef} className="relative w-full max-w-4xl mx-auto" style={{
              minHeight: 400,
              transform: 'scale(0.85)'
            }}>
                {/* Main Dashboard Image */}
                <div className="relative group">
                  <div className="bg-white/20 backdrop-blur-lg p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/30 transition-all duration-700 hover:scale-105 hover:shadow-3xl group-hover:bg-white/25 px-0 py-0">
                    <img src="/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png" alt="Rolling Availability Calendar and Burn Meter Dashboard" className="w-full rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105 aspect-square object-cover" style={{
                    transform: 'scale(0.90)'
                  }} />
                  </div>
                </div>
                
                {/* Floating Insight Cards - Only visible on larger screens */}
                {floatingVisible && <div className="hidden lg:block">
                    <FloatingInsightCards utilizationRate={87} teamSize={12} activeProjects={15} timeRange="month" scale={0.9} />
                  </div>}
              </div>
            </AnimatedSection>
          </div>

          {/* Mobile-only Dashboard Preview */}
          <div className="block sm:hidden w-full mt-6">
            <AnimatedSection animation="fadeInUp" delay={600}>
              <div className="bg-white/20 backdrop-blur-lg p-3 rounded-2xl shadow-xl border border-white/30" style={{
              transform: 'scale(0.85)'
            }}>
                <img src="/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png" alt="Rolling Availability Calendar and Burn Meter Dashboard" className="w-full rounded-xl shadow-lg aspect-square object-cover" style={{
                transform: 'scale(0.90)'
              }} />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;