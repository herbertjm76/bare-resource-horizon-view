
import React from 'react';
import { Zap } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';

export const PricingHeader = () => (
  <AnimatedSection animation="fadeInUp" className="text-center mb-12">
    <div className="flex items-center justify-center mb-6">
      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center animate-pulse">
        <Zap className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4">
        <div className="inline-flex items-center px-3 py-1 bg-green-100 rounded-full text-green-600 font-semibold text-sm mb-1">
          Simple Flat Rate Pricing
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
          One Price, No Surprises
        </h2>
      </div>
    </div>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      Predictable pricing that scales with your team. All plans include 14-day free trial.
    </p>
  </AnimatedSection>
);
