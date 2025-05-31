
import React from 'react';
import { Brain } from 'lucide-react';
import { VisualCard } from '@/components/common/VisualElements';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
  premium?: boolean;
  index: number;
  isVisible: boolean;
}

export const FeatureCard = ({ icon, title, description, highlight, premium, index, isVisible }: FeatureCardProps) => (
  <VisualCard 
    className={`group transition-all duration-500 ${
      highlight 
        ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-105' 
        : 'bg-white'
    } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} p-4`}
    style={{ transitionDelay: `${index * 150}ms` }}
  >
    {premium && (
      <div className="absolute -top-2 -right-2">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-2 py-1 rounded-full font-bold text-xs flex items-center gap-1">
          <Brain className="w-3 h-3" />
          AI
        </div>
      </div>
    )}
    
    <div className="relative">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 ${
        highlight 
          ? 'bg-white/20 backdrop-blur-sm' 
          : 'bg-gradient-to-br from-purple-100 to-blue-100'
      }`}>
        <div className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
      
      <h3 className={`text-lg font-bold mb-3 ${
        highlight ? 'text-white' : 'text-gray-900 group-hover:text-purple-600'
      }`}>
        {title}
      </h3>
      
      <p className={`leading-relaxed text-sm ${
        highlight ? 'text-white/90' : 'text-gray-600'
      }`}>
        {description}
      </p>
    </div>
  </VisualCard>
);
