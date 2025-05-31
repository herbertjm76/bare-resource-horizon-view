
import React from 'react';
import { GradientOrbs } from '@/components/common/VisualElements';
import { BenefitsHeader, BenefitsGrid, BenefitsComparison } from './benefits';

const Benefits = () => {
  return (
    <div id="benefits" className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <GradientOrbs />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <BenefitsHeader />
        <BenefitsGrid />
        <BenefitsComparison />
      </div>
    </div>
  );
};

export default Benefits;
