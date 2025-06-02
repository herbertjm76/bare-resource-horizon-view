
import React from 'react';
import { AnimatedSection } from '@/components/common/AnimatedSection';

const SocialProof = () => {
  const studioLogos = [
    { name: "Design Co", logo: "DC" },
    { name: "Creative Labs", logo: "CL" },
    { name: "Studio X", logo: "SX" },
    { name: "Brand Works", logo: "BW" },
    { name: "Visual Arts", logo: "VA" }
  ];

  return (
    <div className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp">
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-8">Trusted by design studios worldwide</p>
            
            {/* Studio logos */}
            <div className="flex justify-center items-center space-x-8 mb-8 opacity-60">
              {studioLogos.map((studio, index) => (
                <div 
                  key={index}
                  className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-semibold text-sm hover:opacity-100 transition-opacity duration-300"
                >
                  {studio.logo}
                </div>
              ))}
            </div>
            
            {/* Testimonial quote */}
            <blockquote className="text-xl font-medium text-gray-900 max-w-2xl mx-auto">
              "BareResource cut our over-capacity days by 30%."
            </blockquote>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default SocialProof;
