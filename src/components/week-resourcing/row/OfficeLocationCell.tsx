
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useOfficeDisplay } from '@/components/weekly-overview/hooks/useOfficeDisplay';

interface OfficeLocationCellProps {
  member: any;
}

export const OfficeLocationCell: React.FC<OfficeLocationCellProps> = ({ member }) => {
  const { getOfficeDisplay } = useOfficeDisplay();
  
  // Get office location and display
  const officeLocation = member.location || 'Unassigned';
  const displayText = getOfficeDisplay(officeLocation);
  
  // Extract emoji if available (first character might be an emoji flag)
  const hasEmoji = /\p{Emoji}/u.test(displayText.charAt(0));
  const emoji = hasEmoji ? displayText.charAt(0) : '🏢';
  const locationName = hasEmoji ? displayText.substring(1).trim() : displayText;

  return (
    <TableCell className="sticky-column sticky-left-24 border-r p-0 text-center">
      <div className="flex items-center justify-center gap-1 py-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-lg">{emoji}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{locationName}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TableCell>
  );
};
