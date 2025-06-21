
import React from 'react';

interface StandardizedBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'countdown' | 'status' | 'count';
  className?: string;
  style?: React.CSSProperties;
}

export const StandardizedBadge: React.FC<StandardizedBadgeProps> = ({ 
  children, 
  variant = 'default',
  className = '',
  style
}) => {
  const baseClasses = "text-xs font-medium px-2.5 py-1";
  
  const variantClasses = {
    default: "ml-auto bg-gray-100 text-gray-500 border border-gray-200 rounded-full",
    countdown: "ml-auto bg-gray-100 text-gray-500 border border-gray-200 rounded-full",
    status: "bg-gray-100 text-gray-500 border border-gray-200", // No default rounding for status variant
    count: "ml-auto bg-gray-100 text-gray-500 border border-gray-200 rounded-full"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
