
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
  const baseClasses = "text-xs font-medium px-2.5 py-1 rounded-full";
  
  const variantClasses = {
    default: "ml-auto bg-gray-100 text-gray-500 border border-gray-200",
    countdown: "ml-auto bg-gray-100 text-gray-500 border border-gray-200",
    status: "bg-gray-100 text-gray-500 border border-gray-200",
    count: "ml-auto bg-gray-100 text-gray-500 border border-gray-200"
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
