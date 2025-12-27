
import React from 'react';
import { VisualCard } from '@/components/common/VisualElements';

interface BenefitsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  example: string;
  color: string;
  stats: string;
  index: number;
  isVisible: boolean;
}

export const BenefitsCard = ({ 
  icon, 
  title, 
  description, 
  example, 
  color, 
  stats, 
  index, 
  isVisible 
}: BenefitsCardProps) => (
  <div 
    className={`group relative transition-all duration-700 cursor-pointer ${
      isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
    }`}
    style={{ 
      transitionDelay: `${index * 150}ms`,
      transformStyle: 'preserve-3d'
    }}
  >
    <VisualCard className="h-full group-hover:scale-105 group-hover:-rotate-1 p-6 relative overflow-hidden transition-all duration-500 shadow-lg hover:shadow-2xl border border-border hover:border-purple-200">
      {/* Background gradient that appears on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
          <div className="text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
            {icon}
          </div>
        </div>
        
        <div className="mb-3 transform transition-transform duration-300 group-hover:translate-x-1">
          <span className={`inline-block px-3 py-1 bg-gradient-to-r ${color} bg-opacity-10 text-purple-600 rounded-full text-xs font-semibold transition-all duration-300 group-hover:scale-105`}>
            {stats}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-foreground mb-2 transition-all duration-300 group-hover:text-purple-600">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 transition-colors duration-300 group-hover:text-foreground">
          {description}
        </p>
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 border-l-2 border-purple-500 transition-all duration-300 group-hover:border-l-4 group-hover:from-purple-100 group-hover:to-blue-100 group-hover:shadow-md">
          <p className="text-xs font-medium text-foreground italic transition-colors duration-300 group-hover:text-foreground">
            "{example}"
          </p>
        </div>
        
        {/* Floating indicator on hover */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </VisualCard>
  </div>
);
