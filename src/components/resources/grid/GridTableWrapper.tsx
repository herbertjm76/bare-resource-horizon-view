
import React from 'react';
import { Card } from '@/components/ui/card';

interface GridTableWrapperProps {
  children: React.ReactNode;
  tableWidth?: number;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children, tableWidth }) => {
  return (
    <Card className="w-full overflow-hidden">
      <div className="w-full flex justify-center">
        <div 
          className="overflow-x-auto"
          style={{ 
            width: tableWidth ? `${tableWidth}px` : 'fit-content',
            maxWidth: '100%'
          }}
        >
          {children}
        </div>
      </div>
    </Card>
  );
};
