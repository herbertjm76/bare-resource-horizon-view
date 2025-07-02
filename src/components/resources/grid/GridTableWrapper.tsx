
import React from 'react';

interface GridTableWrapperProps {
  children: React.ReactNode;
  tableWidth?: number;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children }) => {
  return (
    <div className="w-full overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-white">
      {children}
    </div>
  );
};
