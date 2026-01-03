
import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { EarlyAccessModal } from './EarlyAccessModal';

export const PricingPlans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AnimatedSection animation="cascadeScale" delay={200} className="max-w-xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white shadow-2xl">
          <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-white/90 font-semibold text-sm mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Limited to 100 Founding Members
          </div>
          
          <h3 className="text-2xl font-bold mb-3">
            Get Early Access
          </h3>
          
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Be the first to try our resource planning tool. Founding members get exclusive pricing and direct input on features.
          </p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-purple-600 hover:bg-gray-100 py-3 px-8 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
          >
            Reserve Your Spot
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-white/60 text-sm mt-4">
            No credit card required • We'll notify you when we launch
          </p>
        </div>
      </AnimatedSection>

      <EarlyAccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        planName="Early Access"
      />
    </>
  );
};
