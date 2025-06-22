
import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';

interface ProjectCellTooltipProps {
  projectName: string;
  projectCode: string;
  memberName: string;
  selectedWeek: Date;
  totalHours: number;
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
  dailyBreakdown = []
}) => {
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Create daily hours map
  const dailyHours = new Map<string, number>();
  dailyBreakdown.forEach(day => {
    dailyHours.set(day.date, day.hours);
  });

  return (
    <div className="space-y-3 max-w-xs">
      <div className="font-bold text-sm text-[#6465F0] border-b border-gray-200 pb-2">
        {projectCode || projectName}
      </div>
      
      <div className="text-xs text-gray-600">
        <div><strong>Member:</strong> {memberName}</div>
        <div><strong>Total Hours:</strong> {totalHours}h this week</div>
      </div>

      {dailyBreakdown.length > 0 && (
        <div>
          <div className="font-semibold text-xs mb-2">Daily Breakdown</div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, index) => {
              const date = format(addDays(weekStart, index), 'yyyy-MM-dd');
              const hours = dailyHours.get(date) || 0;
              return (
                <div key={day} className="text-center">
                  <div className="font-medium text-[10px] text-gray-600">{day}</div>
                  <div className={`text-center p-1 rounded text-[10px] font-medium ${
                    hours > 0 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-gray-50 text-gray-400'
                  }`}>
                    {hours > 0 ? `${hours}h` : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-[10px] text-gray-500 italic">
        Week of {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
      </div>
    </div>
  );
};
