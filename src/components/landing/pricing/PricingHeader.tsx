
import React from 'react';
import { Zap } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';

export const PricingHeader = () => (
  <AnimatedSection animation="cascadeUp" delay={0} className="text-center mb-12">
    <div className="flex flex-col items-center justify-center mb-6">
      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-amber-700 font-semibold text-sm mb-4 border border-amber-200">
        <Zap className="w-4 h-4 mr-2" />
        Limited Early Access
      </div>
      <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
        Be a Founding Member
      </h2>
    </div>
    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
      Join the first 100 teams to shape the future of resource planning. Lock in founding member pricing forever.
    </p>
  </AnimatedSection>
);
