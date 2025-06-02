
import React from 'react';
import { AnimatedSection } from '@/components/common/AnimatedSection';

const FooterCTA = () => {
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
    <div className="py-16 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection animation="fadeInUp">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to see capacity three months out?
          </h2>
          
          <button 
            onClick={() => scrollToSection('signup')}
            className="bg-white text-purple-600 px-12 py-4 rounded-2xl font-bold text-xl hover:bg-purple-50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl"
          >
            Start Free Trial
          </button>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default FooterCTA;
