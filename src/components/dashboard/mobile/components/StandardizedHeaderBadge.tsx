
import React from 'react';

interface StandardizedHeaderBadgeProps {
  children: React.ReactNode;
}

export const StandardizedHeaderBadge: React.FC<StandardizedHeaderBadgeProps> = ({ children }) => {
  return (
    <div className="ml-auto bg-gray-100 text-gray-500 border border-gray-200 text-xs font-medium px-2.5 py-1 rounded-full">
      {children}
    </div>
  );
};
