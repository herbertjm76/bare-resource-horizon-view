
import React from 'react';
import { Card } from '@/components/ui/card';

interface GridTableWrapperProps {
  children: React.ReactNode;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children }) => {
  return (
    <Card className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <div className="flex justify-center w-full">
          <div className="inline-block max-w-full">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
};
