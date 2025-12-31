
import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue, formatUtilizationSummary } from '@/utils/allocationDisplay';
import { logger } from '@/utils/logger';

interface EnhancedUtilizationPopoverProps {
  memberName: string;
  selectedWeek: Date;
  totalUsedHours: number;
  weeklyCapacity: number;
  utilizationPercentage: number;
  annualLeave: number;
  holidayHours: number;
  otherLeave: number;
  projects: Array<{
    project_id: string;
    project_name: string;
    project_code: string;
    total_hours: number;
    daily_breakdown: Array<{
      date: string;
      hours: number;
    }>;
  }>;
}

export const EnhancedUtilizationPopover: React.FC<EnhancedUtilizationPopoverProps> = ({
  memberName,
  selectedWeek,
  totalUsedHours,
  weeklyCapacity,
  utilizationPercentage,
  annualLeave,
  holidayHours,
  otherLeave,
  projects
}) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate total project hours
  const totalProjectHours = projects.reduce((sum, p) => sum + p.total_hours, 0);
  
  logger.debug(`DEBUG EnhancedUtilizationPopover for ${memberName}:`, {
    receivedTotalUsedHours: totalUsedHours,
    receivedUtilizationPercentage: utilizationPercentage,
    receivedWeeklyCapacity: weeklyCapacity,
    calculatedTotalFromProjects: totalProjectHours,
    projectsData: projects
  });

  // Create daily breakdown map for all projects combined
  const dailyBreakdown = new Map<string, number>();
  projects.forEach(project => {
    project.daily_breakdown.forEach(day => {
      const current = dailyBreakdown.get(day.date) || 0;
      dailyBreakdown.set(day.date, current + day.hours);
    });
  });

  const capacity = weeklyCapacity || workWeekHours;

  return (
    <div className="space-y-4 max-w-lg">
      <div className="font-bold text-base text-[#6465F0] border-b border-gray-200 pb-2">
        {memberName} — Weekly Utilization
      </div>
      


      {/* Project Breakdown */}
      {projects.length > 0 && (
        <div className="border-t border-gray-200 pt-3">
          <div className="font-semibold text-xs mb-2">Projects This Week</div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {projects.map(project => (
              <div key={project.project_id} className="flex justify-between items-center text-xs bg-gray-50 p-1.5 rounded">
                <span className="text-gray-700 truncate flex-1">
                  {project.project_code}
                </span>
                <span className="font-medium text-blue-600 ml-2">
                  {formatAllocationValue(project.total_hours, capacity, displayPreference)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center font-medium text-xs mt-2 pt-2 border-t border-gray-200">
            <span>Total Project Hours:</span>
            <span className="text-blue-600">{formatAllocationValue(totalProjectHours, capacity, displayPreference)}</span>
          </div>
        </div>
      )}

      {/* Leave Breakdown */}
      {(annualLeave > 0 || holidayHours > 0 || otherLeave > 0) && (
        <div className="border-t border-gray-200 pt-3">
          <div className="font-semibold text-xs mb-2">Leave Breakdown</div>
          <div className="space-y-1 text-xs">
            {annualLeave > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600">Leave:</span>
                <span className="font-medium">{formatAllocationValue(annualLeave, capacity, displayPreference)}</span>
              </div>
            )}
            {holidayHours > 0 && (
              <div className="flex justify-between">
                <span className="text-purple-600">Holiday Hours:</span>
                <span className="font-medium">{formatAllocationValue(holidayHours, capacity, displayPreference)}</span>
              </div>
            )}
            {otherLeave > 0 && (
              <div className="flex justify-between">
                <span className="text-orange-600">Other Leave:</span>
                <span className="font-medium">{formatAllocationValue(otherLeave, capacity, displayPreference)}</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
