
import React from 'react';
import { GradientOrbs } from '@/components/common/VisualElements';
import { FeaturesHeader, FeaturesGrid, PremiumFeatures } from './features';

const Features = () => {
  return (
    <section id="features" className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <GradientOrbs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FeaturesHeader />
        <FeaturesGrid />
        <PremiumFeatures />
      </div>
    </section>
  );
};

export default Features;
