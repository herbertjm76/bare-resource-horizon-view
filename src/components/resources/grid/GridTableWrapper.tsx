
import React from 'react';
import { Card } from '@/components/ui/card';

interface GridTableWrapperProps {
  children: React.ReactNode;
  tableWidth?: number;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children, tableWidth }) => {
  return (
    <Card className="w-full overflow-hidden">
      <div className="project-resourcing-grid-container">
        <div className="project-resourcing-table-wrapper">
          {children}
        </div>
      </div>
    </Card>
  );
};
