import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue } from '@/utils/allocationDisplay';
import { getProjectDisplayName } from '@/utils/projectDisplay';

interface ProjectCellTooltipProps {
  projectName: string;
  projectCode: string;
  memberName: string;
  selectedWeek: Date;
  totalHours: number;
  capacity: number;
  dailyBreakdown?: Array<{
    date: string;
    hours: number;
  }>;
}

export const ProjectCellTooltip: React.FC<ProjectCellTooltipProps> = ({
  projectName,
  projectCode,
  memberName,
  selectedWeek,
  totalHours,
  capacity,
  dailyBreakdown = []
}) => {
  const { displayPreference, projectDisplayPreference } = useAppSettings();
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const formatValue = (value: number) =>
    formatAllocationValue(value, capacity, displayPreference);
  
  // Create daily hours map
  const dailyHours = new Map<string, number>();
  dailyBreakdown.forEach(day => {
    dailyHours.set(day.date, day.hours);
  });

  // Use project display preference for consistent display
  const projectDisplayText = getProjectDisplayName(
    { code: projectCode, name: projectName },
    projectDisplayPreference
  );

  return (
    <div className="space-y-3 max-w-xs">
      <div className="font-bold text-sm text-brand-secondary border-b border-gray-200 pb-2">
        {projectDisplayText}
      </div>
      
      <div className="text-xs text-gray-600">
        <div><strong>Member:</strong> {memberName}</div>
        <div><strong>Total:</strong> {formatValue(totalHours)} this week</div>
      </div>


      <div className="text-[10px] text-gray-500 italic">
        Week of {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
      </div>
    </div>
  );
};
