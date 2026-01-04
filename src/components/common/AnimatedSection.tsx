
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'cascadeUp' | 'cascadeScale';
  delay?: number;
  className?: string;
  /** Enable staggered animation for direct children */
  staggerChildren?: boolean;
  /** Delay between each child animation in ms */
  staggerDelay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
  children, 
  animation = 'cascadeUp',
  delay = 0,
  className = '',
  staggerChildren = false,
  staggerDelay = 75
}) => {
  const { elementRef, isVisible } = useScrollAnimation<HTMLDivElement>();

  const animationClasses = {
    fadeIn: 'opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]',
    fadeInUp: 'opacity-0 translate-y-8 animate-[fadeInUp_0.8s_ease-out_forwards]',
    fadeInLeft: 'opacity-0 -translate-x-8 animate-[fadeInLeft_0.8s_ease-out_forwards]',
    fadeInRight: 'opacity-0 translate-x-8 animate-[fadeInRight_0.8s_ease-out_forwards]',
    scaleIn: 'opacity-0 scale-95 animate-[scaleIn_0.7s_ease-out_forwards]',
    cascadeUp: 'opacity-0 translate-y-12 animate-[cascadeUp_0.8s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]',
    cascadeScale: 'opacity-0 scale-90 animate-[cascadeScale_0.8s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]'
  };

  // If staggerChildren is enabled, wrap each child with staggered animation
  const renderChildren = () => {
    if (!staggerChildren || !isVisible) {
      return children;
    }

    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;
      
      const childDelay = delay + (index * staggerDelay);
      
      return (
        <div 
          className={`opacity-0 translate-y-6 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]`}
          style={{ animationDelay: `${childDelay}ms` }}
        >
          {child}
        </div>
      );
    });
  };

  return (
    <div 
      ref={elementRef}
      className={`${isVisible ? animationClasses[animation] : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {staggerChildren ? renderChildren() : children}
    </div>
  );
};
