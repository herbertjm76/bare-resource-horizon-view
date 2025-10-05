
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface OfficeCellProps {
  location?: string;
}

export const OfficeCell: React.FC<OfficeCellProps> = ({ location }) => {
  const locationDisplay = location || 'N/A';
  const locationAbbreviation = location ? location.substring(0, 3).toUpperCase() : 'N/A';

  return (
    <TableCell className="text-center border-r p-1 mobile-office-cell bg-muted/20">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center w-8 h-6 text-xs font-medium bg-secondary/50 border border-border text-secondary-foreground rounded-lg">
            {locationAbbreviation}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Office: {locationDisplay}</p>
        </TooltipContent>
      </Tooltip>
    </TableCell>
  );
};
