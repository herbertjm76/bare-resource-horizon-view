
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
          width: 'calc(100vw - 22rem)',
          maxWidth: 'calc(100vw - 22rem)'
        }}
      >
        <div className="enhanced-grid-container">
          {children}
        </div>
      </div>
    </Card>
  );
};
