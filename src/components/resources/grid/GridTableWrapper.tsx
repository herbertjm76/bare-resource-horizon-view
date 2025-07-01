
import React from 'react';
import { Card } from '@/components/ui/card';

interface GridTableWrapperProps {
  children: React.ReactNode;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children }) => {
  return (
    <Card className="w-full overflow-hidden">
      <div className="overflow-x-auto flex justify-center">
        <div className="inline-block">
          {children}
        </div>
      </div>
    </Card>
  );
};
