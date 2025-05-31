
import React from 'react';
import { AlertTriangle, Brain, ArrowRight, Clock, CheckCircle, Zap } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { VisualCard, GradientOrbs, StatsVisualization } from '@/components/common/VisualElements';

export const BenefitsComparison = () => {
  const comparisonStats = [
    { value: "5hrs", label: "Weekly Planning", icon: Clock },
    { value: "0", label: "Hiring Mistakes", icon: CheckCircle },
    { value: "10x", label: "Faster Insights", icon: Zap },
    { value: "24/7", label: "AI Monitoring", icon: Brain }
  ];

  return (
    <AnimatedSection animation="scaleIn" delay={400}>
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
        <GradientOrbs />
        
        <div className="relative">
          <div className="text-center mb-6">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              From Reactive to Proactive
            </h3>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 items-center">
            <AnimatedSection animation="fadeInLeft" delay={200}>
              <VisualCard className="border-red-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900">With Excel</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    "We're overwhelmed!"
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    "Why did we lose that client?"
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    "Is the team burning out?"
                  </li>
                </ul>
              </VisualCard>
            </AnimatedSection>

            <div className="flex justify-center">
              <ArrowRight className="w-8 h-8 text-purple-600 animate-pulse" />
            </div>

            <AnimatedSection animation="fadeInRight" delay={400}>
              <VisualCard className="border-green-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900">With BareResource AI</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    "Need to hire more designers"
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    "Need more projects in pipeline"
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    "Team at high capacity"
                  </li>
                </ul>
              </VisualCard>
            </AnimatedSection>
          </div>
          
          <div className="mt-8">
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">The Numbers Don't Lie</h4>
            <StatsVisualization stats={comparisonStats} />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
