
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
    className={`group relative transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}
    style={{ transitionDelay: `${index * 150}ms` }}
  >
    <VisualCard className="h-full group-hover:scale-105 p-4">
      <div className="relative">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        <div className="mb-2">
          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold">
            {stats}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {description}
        </p>
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-2 border-l-2 border-purple-500">
          <p className="text-xs font-medium text-gray-700 italic">
            "{example}"
          </p>
        </div>
      </div>
    </VisualCard>
  </div>
);
