
import React from 'react';
import { CheckCircle, X, ArrowRight, BarChart3, Calendar, Users } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { GradientOrbs } from '@/components/common/VisualElements';

export const BenefitsComparison = () => {
  const comparisons = [
    {
      traditional: "Spreadsheet chaos across multiple files",
      bareresource: "Centralized resource planning dashboard",
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      traditional: "Manual capacity calculations",
      bareresource: "Automated utilization tracking",
      icon: <Calendar className="w-5 h-5" />
    },
    {
      traditional: "Email updates about team changes",
      bareresource: "Real-time team workload visibility",
      icon: <Users className="w-5 h-5" />
    }
  ];

  return (
    <AnimatedSection animation="scaleIn" delay={400}>
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 lg:p-8 relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-105 group cursor-pointer">
        <GradientOrbs />
        
        <div className="relative">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 transition-colors duration-300 group-hover:text-purple-600">
              Why Teams Choose BareResource
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto transition-colors duration-300 group-hover:text-foreground">
              Move from reactive spreadsheet management to proactive resource planning
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-4 mb-6 text-center">
              <div className="text-red-600 font-semibold transition-all duration-300 hover:scale-105">Traditional Methods</div>
              <div></div>
              <div className="text-green-600 font-semibold transition-all duration-300 hover:scale-105">With BareResource</div>
            </div>
            
            <div className="space-y-4">
              {comparisons.map((item, index) => (
                <AnimatedSection key={index} animation="fadeInUp" delay={index * 200}>
                  <div className="grid lg:grid-cols-3 gap-4 items-center bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 transition-all duration-500 hover:bg-white/90 hover:shadow-lg hover:scale-105 group cursor-pointer">
                    <div className="flex items-center gap-3 transition-all duration-300 group-hover:translate-x-2">
                      <X className="w-5 h-5 text-red-500 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12" />
                      <span className="text-foreground text-sm transition-colors duration-300 group-hover:text-foreground">{item.traditional}</span>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="hidden lg:flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 group-hover:scale-110 group-hover:rotate-180">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 transition-all duration-300 group-hover:translate-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      <span className="text-foreground text-sm font-medium transition-colors duration-300 group-hover:text-green-700">{item.bareresource}</span>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:scale-105 group cursor-pointer">
                <div className="flex gap-4">
                  <div className="text-center transition-all duration-300 group-hover:scale-110">
                    <div className="text-2xl font-bold text-purple-600 transition-colors duration-300 group-hover:text-purple-700">5hrs</div>
                    <div className="text-xs text-muted-foreground">Saved Weekly</div>
                  </div>
                  <div className="text-center transition-all duration-300 group-hover:scale-110">
                    <div className="text-2xl font-bold text-blue-600 transition-colors duration-300 group-hover:text-blue-700">10x</div>
                    <div className="text-xs text-muted-foreground">Faster Planning</div>
                  </div>
                  <div className="text-center transition-all duration-300 group-hover:scale-110">
                    <div className="text-2xl font-bold text-green-600 transition-colors duration-300 group-hover:text-green-700">100%</div>
                    <div className="text-xs text-muted-foreground">Team Visibility</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
