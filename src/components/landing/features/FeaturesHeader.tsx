
import React from 'react';
import { Sparkles } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';

export const FeaturesHeader = () => (
  <AnimatedSection animation="fadeInUp" className="text-center mb-12">
    <div className="flex items-center justify-center mb-6">
      <div className="group cursor-pointer">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center animate-pulse hover:animate-none transition-all duration-500 hover:scale-110 hover:rotate-6 group-hover:shadow-xl">
          <Sparkles className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
        </div>
      </div>
      <div className="ml-4">
        <div className="inline-flex items-center px-3 py-1 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm mb-1 transition-all duration-300 hover:bg-purple-200 hover:scale-105 cursor-pointer">
          Smart Resource Management
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 transition-all duration-300 hover:text-purple-600 cursor-default">
          Excel Alternative with Intelligence
        </h2>
      </div>
    </div>
    <p className="text-lg text-gray-600 max-w-3xl mx-auto transition-colors duration-300 hover:text-gray-700">
      The familiar resource planning you know, enhanced with insights that guide your business decisions.
    </p>
  </AnimatedSection>
);
