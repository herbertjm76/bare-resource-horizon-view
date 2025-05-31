
import React from 'react';
import { Lightbulb } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';

export const BenefitsHeader = () => (
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
);
