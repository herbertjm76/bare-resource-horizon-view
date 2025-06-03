
import React from 'react';
import { Card } from '@/components/ui/card';

interface GridTableWrapperProps {
  children: React.ReactNode;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children }) => {
  return (
    <Card className="w-full overflow-hidden border-2 border-indigo-100/60 shadow-2xl bg-gradient-to-br from-white via-gray-50/20 to-indigo-50/10 rounded-2xl">
      <div className="enhanced-grid-scroll">
        <div className="enhanced-grid-container">
          {children}
        </div>
      </div>
    </Card>
  );
};
