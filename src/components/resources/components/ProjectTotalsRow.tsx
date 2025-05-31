
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
  
  // Use subtle gray background for consistency
  const rowBgClass = "bg-gray-100/80 border-gray-200 hover:bg-gray-100";

  return (
    <tr className={`border-b ${rowBgClass}`}>
      {/* Fixed counter column */}
      <td className={`sticky left-0 z-10 p-2 w-12 ${rowBgClass} border-r border-gray-200`}></td>
      
      {/* Project totals label */}
      <td 
        className={`sticky left-12 z-10 p-2 ${rowBgClass} border-r border-gray-200`} 
        style={{ width: '200px', minWidth: '200px' }}
      >
        <div className="flex items-center">
          <div className="ml-8">
            <div className="font-medium text-sm text-gray-700">
              Project Totals
            </div>
            <div className="text-xs text-gray-600">
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
          <td key={weekKey} className="p-0 text-center border-r border-gray-200" style={{ width: '10px', minWidth: '10px' }}>
            <div className="py-2 px-0">
              <span className="text-lg font-bold text-gray-700">
                {totalHoursForWeek > 0 ? `${totalHoursForWeek}h` : '0h'}
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
