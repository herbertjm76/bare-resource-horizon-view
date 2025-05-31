
import React from 'react';
import { Card } from '@/components/ui/card';

interface GridTableWrapperProps {
  children: React.ReactNode;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children }) => {
  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/30">
      <div className="enhanced-grid-scroll">
        <div className="enhanced-grid-container">
          {children}
        </div>
      </div>
    </Card>
  );
};
