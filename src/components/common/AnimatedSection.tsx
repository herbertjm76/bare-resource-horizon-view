
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
  delay?: number;
  className?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  animation = 'fadeInUp',
  delay = 0,
  className = ''
}) => {
  const { elementRef, isVisible } = useScrollAnimation<HTMLDivElement>();

  const animationClasses = {
    fadeIn: 'opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]',
    fadeInUp: 'opacity-0 translate-y-8 animate-[fadeInUp_0.6s_ease-out_forwards]',
    fadeInLeft: 'opacity-0 -translate-x-8 animate-[fadeInLeft_0.6s_ease-out_forwards]',
    fadeInRight: 'opacity-0 translate-x-8 animate-[fadeInRight_0.6s_ease-out_forwards]',
    scaleIn: 'opacity-0 scale-95 animate-[scaleIn_0.5s_ease-out_forwards]'
  };

  return (
    <div 
      ref={elementRef}
      className={`${isVisible ? animationClasses[animation] : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
