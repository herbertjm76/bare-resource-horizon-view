
import React from 'react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { GradientOrbs } from '@/components/common/VisualElements';
import { PlayCircle, Calendar } from 'lucide-react';
import FloatingInsightCards from './FloatingInsightCards';

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
    <div className="relative pt-20 bg-gradient-to-br from-[#6E59A5] via-[#895CF7] to-[#E64FC4] overflow-hidden min-h-[70vh]">
      <GradientOrbs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column - Text Content (1/3) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              <AnimatedSection animation="fadeInUp" delay={200}>
                <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white text-sm font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  For Design Studios
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={400}>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                  Resource Planning Software for Design Studios
                </h1>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={600}>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <ul className="space-y-3 text-lg text-white/90">
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
                  className="group bg-white text-purple-600 px-6 py-3 rounded-2xl font-semibold hover:bg-purple-50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl text-base"
                >
                  Start 14-Day Trial
                </button>
                <button className="group bg-white/15 backdrop-blur-sm text-white px-6 py-3 rounded-2xl border border-white/30 hover:bg-white/25 transition-all duration-500 font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:-translate-y-1 hover:shadow-xl">
                  <PlayCircle className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Right Column - Dashboard Image with Floating Cards (2/3) */}
          <div className="lg:col-span-8 relative h-full flex items-center justify-center">
            <AnimatedSection animation="fadeInRight" delay={600}>
              <div 
                ref={floatingRef}
                className="relative w-full max-w-4xl"
              >
                {/* Main Dashboard Image - Full Width */}
                <div className="relative group">
                  <div className="bg-white/20 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/30 transition-all duration-700 hover:scale-105 hover:shadow-3xl group-hover:bg-white/25">
                    <img 
                      src="/lovable-uploads/2e5c6c87-dc1b-4eff-8ab6-d373d5860128.png" 
                      alt="Rolling Availability Calendar and Burn Meter Dashboard" 
                      className="w-full rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>
                
                {/* Floating Insight Cards - Positioned Around Image */}
                {floatingVisible && (
                  <FloatingInsightCards
                    utilizationRate={87}
                    teamSize={12}
                    activeProjects={15}
                    timeRange="month"
                  />
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
