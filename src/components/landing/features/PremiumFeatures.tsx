
import React from 'react';
import { Brain } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { GradientOrbs } from '@/components/common/VisualElements';

export const PremiumFeatures = () => (
  <AnimatedSection animation="scaleIn" delay={400}>
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 lg:p-8 border border-purple-100 relative overflow-hidden">
      <GradientOrbs />
      
      <div className="relative text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-foreground rounded-xl font-bold">
            <Brain className="w-5 h-5 mr-2" />
            Premium AI Features
          </div>
        </div>
        
        <h3 className="text-3xl font-bold text-foreground mb-6">
          Your Studio's Smart Business Advisor
        </h3>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto shadow-xl border border-white/50">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <p className="text-lg text-foreground italic mb-6 font-medium">
            "Based on your current utilization and project pipeline, I recommend hiring more designers. 
            Your team is trending toward high capacity, which may impact quality."
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { color: 'bg-green-500', label: 'Hiring Alerts' },
              { color: 'bg-blue-500', label: 'Pipeline Warnings' },
              { color: 'bg-purple-500', label: 'Capacity Alerts' },
              { color: 'bg-orange-500', label: 'Burnout Prevention' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-8 h-8 ${item.color} rounded-xl mx-auto mb-2 flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AnimatedSection>
);
