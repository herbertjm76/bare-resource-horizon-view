
import React from 'react';
import { X, Check } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';

const ProblemOutcome = () => {
  const comparisons = [
    {
      pain: "People booked at 110%",
      outcome: "See red cells, rebalance in seconds"
    },
    {
      pain: "Fee burn unknown until month-end",
      outcome: "Live % of fee spent, warning at 75%"
    },
    {
      pain: "Guesswork on hiring",
      outcome: "'Need 1 senior designer in 45 days' alert"
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp" className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Spreadsheets hide trouble. BareResource shows it.
          </h2>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          {comparisons.map((item, index) => (
            <AnimatedSection key={index} animation="fadeInUp" delay={index * 200}>
              <div className="grid md:grid-cols-2 gap-8 items-center py-6 border-b border-gray-200 last:border-b-0">
                {/* Pain point */}
                <div className="flex items-center space-x-4 text-red-600">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-medium">{item.pain}</span>
                </div>
                
                {/* Outcome */}
                <div className="flex items-center space-x-4 text-green-600">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-medium">{item.outcome}</span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemOutcome;
