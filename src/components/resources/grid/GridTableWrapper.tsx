
import React from 'react';
import { Card } from '@/components/ui/card';

interface GridTableWrapperProps {
  children: React.ReactNode;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children }) => {
  return (
    <Card className="w-full overflow-hidden">
      <div className="w-full flex justify-center overflow-x-auto">
        <div className="inline-block">
          {children}
        </div>
      </div>
    </Card>
  );
};
