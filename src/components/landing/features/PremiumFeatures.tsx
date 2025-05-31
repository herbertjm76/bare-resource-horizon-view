
import React from 'react';
import { Brain, Users, TrendingUp, Sparkles } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { GradientOrbs } from '@/components/common/VisualElements';

export const PremiumFeatures = () => (
  <AnimatedSection animation="scaleIn" delay={400}>
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 lg:p-8 border border-purple-100 relative overflow-hidden">
      <GradientOrbs />
      
      <div className="relative text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-xl font-bold">
            <Brain className="w-5 h-5 mr-2" />
            Premium AI Features
            <Sparkles className="w-4 h-4 ml-2" />
          </div>
        </div>
        
        <h3 className="text-3xl font-bold text-gray-900 mb-6">
          Your Studio's Smart Business Advisor
        </h3>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto shadow-xl border border-white/50">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <p className="text-lg text-gray-700 italic mb-6 font-medium">
            "Based on your current utilization and project pipeline, I recommend hiring more designers. 
            Your team is trending toward high capacity, which may impact quality."
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { color: 'bg-green-500', label: 'Hiring Alerts', icon: Users },
              { color: 'bg-blue-500', label: 'Pipeline Warnings', icon: TrendingUp },
              { color: 'bg-purple-500', label: 'Capacity Optimization', icon: Users },
              { color: 'bg-orange-500', label: 'Burnout Prevention', icon: Brain }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className={`w-10 h-10 ${item.color} rounded-xl mx-auto mb-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AnimatedSection>
);
