
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { MapPin } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface OfficeLocationCellProps {
  member: any;
}

export const OfficeLocationCell: React.FC<OfficeLocationCellProps> = ({ member }) => {
  // Helper to get office location
  const getOfficeLocation = (): string => {
    return member.location || 'No office';
  };

  return (
    <TableCell className="sticky-column sticky-left-24 border-r p-0 text-center">
      <div className="flex items-center justify-center gap-1 py-1">
        <MapPin size={14} className="text-muted-foreground" />
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs truncate max-w-16">{getOfficeLocation()}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getOfficeLocation()}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TableCell>
  );
};
