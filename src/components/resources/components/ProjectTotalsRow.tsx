
import React from 'react';
import { getWeekKey } from '../utils/milestoneUtils';

interface ProjectTotalsRowProps {
  weeklyProjectHours: Record<string, number>;
  weeks: {
    startDate: Date;
    label: string;
    days: Date[];
  }[];
  isEven?: boolean;
}

export const ProjectTotalsRow: React.FC<ProjectTotalsRowProps> = ({
  weeklyProjectHours,
  weeks,
  isEven = false
}) => {
  // Calculate total hours across all weeks
  const totalHours = Object.values(weeklyProjectHours).reduce((sum, hours) => sum + hours, 0);
  
  // Base background color
  const rowBgClass = isEven 
    ? "bg-blue-50/70" 
    : "bg-blue-50/90";

  return (
    <tr className={`border-b ${rowBgClass}`}>
      {/* Fixed counter column */}
      <td className={`sticky left-0 z-10 p-2 w-12 ${rowBgClass}`}></td>
      
      {/* Project totals label */}
      <td 
        className={`sticky left-12 z-10 p-2 ${rowBgClass}`} 
        style={{ width: '200px', minWidth: '200px' }}
      >
        <div className="flex items-center">
          <div className="ml-8">
            <div className="font-medium text-sm">
              Project Totals
            </div>
            <div className={`text-xs ${totalHours > 0 ? 'text-muted-foreground' : 'text-gray-250'}`}>
              Total Hours: {totalHours}
            </div>
          </div>
        </div>
      </td>
      
      {/* Weekly total hours cells */}
      {weeks.map((week, index) => {
        const weekKey = getWeekKey(week.startDate);
        const totalHoursForWeek = weeklyProjectHours[weekKey] || 0;
        
        return (
          <td key={weekKey} className="p-0 text-center" style={{ width: '10px', minWidth: '10px' }}>
            <div className="py-2 px-0">
              <span className={`text-xs font-bold ${totalHoursForWeek > 0 ? 'text-black' : 'text-gray-250'}`}>
                {totalHoursForWeek}h
              </span>
            </div>
          </td>
        );
      })}
      
      {/* Add blank flexible cell */}
      <td className="p-0"></td>
    </tr>
  );
}
