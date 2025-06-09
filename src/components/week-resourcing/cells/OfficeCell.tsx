
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface OfficeCellProps {
  location?: string;
}

export const OfficeCell: React.FC<OfficeCellProps> = ({ location }) => {
  const displayLocation = location ? (location.length > 3 ? location.substring(0, 3) : location) : 'N/A';
  
  return (
    <TableCell className="text-center border-r text-xs text-gray-600 mobile-office-cell bg-gradient-to-br from-slate-50 to-gray-50">
      <span className="inline-flex items-center justify-center px-2 py-1 bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 rounded-full border border-slate-200 text-xs font-medium shadow-sm">
        <span className="hidden sm:inline">{location || 'N/A'}</span>
        <span className="sm:hidden">{displayLocation}</span>
      </span>
    </TableCell>
  );
};
