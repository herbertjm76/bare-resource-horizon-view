
import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';

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
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate total project hours
  const totalProjectHours = projects.reduce((sum, p) => sum + p.total_hours, 0);

  // Create daily breakdown map for all projects combined
  const dailyBreakdown = new Map<string, number>();
  projects.forEach(project => {
    project.daily_breakdown.forEach(day => {
      const current = dailyBreakdown.get(day.date) || 0;
      dailyBreakdown.set(day.date, current + day.hours);
    });
  });

  return (
    <div className="space-y-4 max-w-lg">
      <div className="font-bold text-base text-[#6465F0] border-b border-gray-200 pb-2">
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
          <div className="text-green-600">{totalUsedHours}h / {weeklyCapacity}h</div>
        </div>
      </div>

      {/* Daily Project Hours Breakdown */}
      <div className="border-t border-gray-200 pt-3">
        <div className="font-semibold text-xs mb-2">Daily Project Hours</div>
        <div className="grid grid-cols-7 gap-1 text-[10px]">
          {weekDays.map((day, index) => {
            const date = format(addDays(weekStart, index), 'yyyy-MM-dd');
            const hours = dailyBreakdown.get(date) || 0;
            return (
              <div key={day} className="text-center">
                <div className="font-medium text-gray-600">{day}</div>
                <div className={`text-center py-1 px-0.5 rounded text-[10px] font-medium ${
                  hours > 0 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-50 text-gray-400'
                }`}>
                  {hours > 0 ? `${hours}h` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Breakdown with Daily Hours */}
      {projects.length > 0 && (
        <div className="border-t border-gray-200 pt-3">
          <div className="font-semibold text-xs mb-2">Projects This Week</div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {projects.map(project => (
              <div key={project.project_id} className="bg-gray-50 p-2 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-700 truncate flex-1">
                    {project.project_code}
                  </span>
                  <span className="font-medium text-blue-600 text-xs ml-2">
                    {project.total_hours}h
                  </span>
                </div>
                {/* Daily breakdown for this project */}
                <div className="grid grid-cols-7 gap-1 mt-1">
                  {weekDays.map((day, index) => {
                    const date = format(addDays(weekStart, index), 'yyyy-MM-dd');
                    const dayData = project.daily_breakdown.find(d => d.date === date);
                    const hours = dayData?.hours || 0;
                    return (
                      <div key={`${project.project_id}-${day}`} className="text-center">
                        <div className={`text-[9px] py-0.5 px-0.5 rounded ${
                          hours > 0 
                            ? 'bg-emerald-100 text-emerald-700 font-medium' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {hours > 0 ? `${hours}h` : '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center font-medium text-xs mt-2 pt-2 border-t border-gray-200">
            <span>Total Project Hours:</span>
            <span className="text-blue-600">{totalProjectHours}h</span>
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
                <span className="text-green-600">Annual Leave:</span>
                <span className="font-medium">{annualLeave}h</span>
              </div>
            )}
            {holidayHours > 0 && (
              <div className="flex justify-between">
                <span className="text-purple-600">Holiday Hours:</span>
                <span className="font-medium">{holidayHours}h</span>
              </div>
            )}
            {otherLeave > 0 && (
              <div className="flex justify-between">
                <span className="text-orange-600">Other Leave:</span>
                <span className="font-medium">{otherLeave}h</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Strategic Insight */}
      <div className="border-t border-gray-200 pt-2 text-xs text-gray-600 italic">
        {utilizationPercentage > 100
          ? "⚠️ Overallocation risk! Review project loads or adjust capacity."
          : utilizationPercentage < 60
          ? "📈 Low utilization. Consider re-assigning or rebalancing workload."
          : "✅ Healthy workload distribution this week."}
      </div>
    </div>
  );
};
