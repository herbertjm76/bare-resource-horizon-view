
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from '../CapacityBar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatUtilizationSummary, formatAvailableValue } from '@/utils/allocationDisplay';

interface CapacityBarCellProps {
  totalUsedHours: number;
  totalCapacity: number;
  projectHours: number;
  annualLeaveHours: number;
  holidayHours: number;
  otherLeaveHours: number;
}

export const CapacityBarCell: React.FC<CapacityBarCellProps> = ({
  totalUsedHours,
  totalCapacity,
  projectHours,
  annualLeaveHours,
  holidayHours,
  otherLeaveHours
}) => {
  const { displayPreference } = useAppSettings();
  
  return (
    <TableCell className="text-center border-r p-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <CapacityBar 
                totalUsedHours={totalUsedHours} 
                totalCapacity={totalCapacity}
                projectHours={projectHours}
                annualLeaveHours={annualLeaveHours}
                holidayHours={holidayHours}
                otherLeaveHours={otherLeaveHours}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm space-y-1">
              <p className="font-medium border-b pb-1 mb-1">Utilization Breakdown</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                <span>Projects: {displayPreference === 'percentage' 
                  ? `${Math.round((projectHours / totalCapacity) * 100)}%` 
                  : `${projectHours}h`}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f97316' }} />
                <span>Annual Leave: {displayPreference === 'percentage' 
                  ? `${Math.round((annualLeaveHours / totalCapacity) * 100)}%` 
                  : `${annualLeaveHours}h`}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#a855f7' }} />
                <span>Holidays: {displayPreference === 'percentage' 
                  ? `${Math.round((holidayHours / totalCapacity) * 100)}%` 
                  : `${holidayHours}h`}</span>
              </div>
              {otherLeaveHours > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6b7280' }} />
                  <span>Other Leave: {displayPreference === 'percentage' 
                    ? `${Math.round((otherLeaveHours / totalCapacity) * 100)}%` 
                    : `${otherLeaveHours}h`}</span>
                </div>
              )}
              <p className="font-medium border-t pt-1 mt-1">
                Total: {formatUtilizationSummary(totalUsedHours, totalCapacity, displayPreference)}
              </p>
              <p className="text-muted-foreground">
                Available: {formatAvailableValue(Math.max(0, totalCapacity - totalUsedHours), totalCapacity, displayPreference)}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};
