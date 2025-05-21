
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';

interface OfficeLocationCellProps {
  member: any;
}

export const OfficeLocationCell: React.FC<OfficeLocationCellProps> = ({ member }) => {
  const { locations } = useOfficeSettings();
  
  // Get office location code from member
  const locationCode = member.location || 'Unassigned';
  
  // Find the matching location in office settings
  const locationData = locations.find(loc => loc.code === locationCode);
  
  // Use location name from settings if found
  const locationName = locationData 
    ? `${locationData.city}, ${locationData.country}`
    : locationCode;

  return (
    <TableCell className="sticky-column sticky-left-24 border-r p-0 text-center">
      <div className="flex items-center justify-center gap-1 py-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-medium">{locationCode}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{locationName}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TableCell>
  );
};
