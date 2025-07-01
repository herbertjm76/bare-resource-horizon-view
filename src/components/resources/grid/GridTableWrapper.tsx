
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface GridTableWrapperProps {
  children: React.ReactNode;
  tableWidth?: number;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children, tableWidth }) => {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-0">
        <div className="workload-grid-container">
          <div className="workload-table-wrapper">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
