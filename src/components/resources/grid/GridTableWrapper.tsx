
import React from 'react';
import { Card } from '@/components/ui/card';

interface GridTableWrapperProps {
  children: React.ReactNode;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children }) => {
  return (
    <div className="project-resourcing-grid-container">
      <div className="project-resourcing-table-wrapper">
        <Card className="w-full overflow-hidden border">
          <div className="project-resourcing-table-scroll">
            <div className="project-resourcing-table-inner">
              {children}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
