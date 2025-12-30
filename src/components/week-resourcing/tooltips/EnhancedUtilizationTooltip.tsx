
import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue, formatUtilizationSummary } from '@/utils/allocationDisplay';

interface ProjectAllocation {
  project_id: string;
  project_name: string;
  project_code: string;
  total_hours: number;
  daily_breakdown: Array<{
    date: string;
    hours: number;
  }>;
}

interface EnhancedUtilizationTooltipProps {
  memberName: string;
  selectedWeek: Date;
  totalUsedHours: number;
  weeklyCapacity: number;
  utilizationPercentage: number;
  annualLeave: number;
  holidayHours: number;
  otherLeave: number;
  projects: ProjectAllocation[];
}

export const EnhancedUtilizationTooltip: React.FC<EnhancedUtilizationTooltipProps> = ({
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

  // Create daily breakdown map
  const dailyBreakdown = new Map<string, number>();
  projects.forEach(project => {
    project.daily_breakdown.forEach(day => {
      const current = dailyBreakdown.get(day.date) || 0;
      dailyBreakdown.set(day.date, current + day.hours);
    });
  });

  const capacity = weeklyCapacity || workWeekHours;

  return (
    <div className="space-y-3 max-w-sm">
      <div className="font-bold text-base text-[#6465F0] border-b border-border pb-2">
        {memberName} — Weekly Utilization
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-blue-50 p-2 rounded">
          <div className="font-semibold text-blue-700">Utilization</div>
          <div className="text-blue-600">{utilizationPercentage}%</div>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <div className="font-semibold text-green-700">Capacity</div>
          <div className="text-green-600">{formatUtilizationSummary(totalUsedHours, capacity, displayPreference)}</div>
        </div>
      </div>


      {/* Project Breakdown */}
      {projects.length > 0 && (
        <div className="border-t border-border pt-2">
          <div className="font-semibold text-xs mb-2">Project Allocations</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {projects.map(project => (
              <div key={project.project_id} className="flex justify-between items-center text-xs bg-muted p-1.5 rounded">
                <span className="text-foreground truncate flex-1">
                  {project.project_code}
                </span>
                <span className="font-medium text-blue-600 ml-2">
                  {formatAllocationValue(project.total_hours, capacity, displayPreference)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center font-medium text-xs mt-2 pt-1 border-t border-border">
            <span>Total Projects:</span>
            <span className="text-blue-600">{formatAllocationValue(totalProjectHours, capacity, displayPreference)}</span>
          </div>
        </div>
      )}

      {/* Leave Breakdown */}
      {(annualLeave > 0 || holidayHours > 0 || otherLeave > 0) && (
        <div className="border-t border-border pt-2">
          <div className="font-semibold text-xs mb-2">Leave Breakdown</div>
          <div className="space-y-1 text-xs">
            {annualLeave > 0 && (
              <div className="flex justify-between">
                <span className="text-green-600">Annual Leave:</span>
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

      {/* Strategic Insight */}
      <div className="border-t border-border pt-2 text-xs text-muted-foreground italic">
        {utilizationPercentage > 100
          ? "⚠️ Overallocation risk! Review project loads or adjust capacity."
          : utilizationPercentage < 60
          ? "📈 Low utilization. Consider re-assigning or rebalancing workload."
          : "✅ Healthy workload distribution this week."}
      </div>
    </div>
  );
};
