
import React from 'react';
import { Sparkles } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';

export const FeaturesHeader = () => (
  <AnimatedSection animation="fadeInUp" className="text-center mb-12">
    <div className="flex items-center justify-center mb-6">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center animate-pulse">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4">
        <div className="inline-flex items-center px-3 py-1 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm mb-1">
          AI-Powered Excel Replacement
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
          Excel + AI Intelligence
        </h2>
      </div>
    </div>
    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
      The familiar resource planning you know, enhanced with AI that guides your business decisions.
    </p>
  </AnimatedSection>
);
