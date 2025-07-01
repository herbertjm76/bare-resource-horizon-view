
import React from 'react';
import { Card } from '@/components/ui/card';

interface GridTableWrapperProps {
  children: React.ReactNode;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children }) => {
  return (
    <Card className="w-full overflow-hidden">
      <div className="w-full overflow-x-auto">
        <div className="flex justify-center">
          <div className="inline-block">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
};
