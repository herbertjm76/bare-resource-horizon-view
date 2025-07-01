
import React from 'react';
import { Card } from '@/components/ui/card';

interface GridTableWrapperProps {
  children: React.ReactNode;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children }) => {
  return (
    <Card className="w-full overflow-hidden">
      <div 
        className="overflow-x-auto overflow-y-visible"
        style={{
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <div className="enhanced-grid-container w-full">
          {children}
        </div>
      </div>
    </Card>
  );
};
