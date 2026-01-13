
import React from 'react';
import '../css/grid-table-wrapper.css';

interface GridTableWrapperProps {
  children: React.ReactNode;
  tableWidth?: number;
}

export const GridTableWrapper: React.FC<GridTableWrapperProps> = ({ children }) => {
  return (
    <div className="grid-table-wrapper-container">
      <div className="grid-table-scroll-area">
        {children}
      </div>
    </div>
  );
};
