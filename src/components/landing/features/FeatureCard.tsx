
import React from 'react';
import { VisualCard } from '@/components/common/VisualElements';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
  index: number;
  isVisible: boolean;
}

export const FeatureCard = ({ icon, title, description, highlight, index, isVisible }: FeatureCardProps) => (
  <VisualCard 
    className={`group relative transition-all duration-700 cursor-pointer ${
      highlight 
        ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-105 shadow-2xl shadow-purple-500/25' 
        : 'bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-white shadow-lg hover:shadow-2xl'
    } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} p-6 border border-transparent hover:border-purple-200`}
    style={{ 
      transitionDelay: `${index * 100}ms`,
      transformStyle: 'preserve-3d'
    }}
  >
    {/* Hover glow effect */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="relative z-10">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
        highlight 
          ? 'bg-white/20 backdrop-blur-sm shadow-xl' 
          : 'bg-gradient-to-br from-purple-100 to-blue-100 group-hover:from-purple-200 group-hover:to-blue-200'
      }`}>
        <div className="transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
          {icon}
        </div>
      </div>
      
      <h3 className={`text-lg font-bold mb-3 transition-all duration-300 ${
        highlight ? 'text-white' : 'text-gray-900 group-hover:text-purple-600'
      }`}>
        {title}
      </h3>
      
      <p className={`leading-relaxed text-sm transition-all duration-300 ${
        highlight ? 'text-white/90' : 'text-gray-600 group-hover:text-gray-700'
      }`}>
        {description}
      </p>
      
      {/* Interactive arrow that appears on hover */}
      <div className={`mt-4 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${
        highlight ? 'text-white/80' : 'text-purple-600'
      }`}>
        <span className="text-sm font-medium">Learn more →</span>
      </div>
    </div>
    
    {/* Subtle pulse animation for highlighted card */}
    {highlight && (
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 animate-pulse"></div>
    )}
  </VisualCard>
);
