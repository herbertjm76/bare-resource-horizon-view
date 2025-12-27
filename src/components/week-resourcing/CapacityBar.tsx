
import React from 'react';
import { cn } from '@/lib/utils';

interface CapacityBarProps {
  totalUsedHours: number;
  totalCapacity: number;
  projectHours?: number;
  annualLeaveHours?: number;
  holidayHours?: number;
  otherLeaveHours?: number;
}

export const CapacityBar: React.FC<CapacityBarProps> = ({
  totalUsedHours,
  totalCapacity,
  projectHours = 0,
  annualLeaveHours = 0,
  holidayHours = 0,
  otherLeaveHours = 0
}) => {
  // Calculate utilization percentage based on actual used hours vs total capacity
  const utilizationPercentage = totalCapacity > 0 ? (totalUsedHours / totalCapacity) * 100 : 0;
  const utilizationRate = Math.round(utilizationPercentage);
  
  // Calculate segment percentages
  const projectPercent = totalCapacity > 0 ? (projectHours / totalCapacity) * 100 : 0;
  const annualLeavePercent = totalCapacity > 0 ? (annualLeaveHours / totalCapacity) * 100 : 0;
  const holidayPercent = totalCapacity > 0 ? (holidayHours / totalCapacity) * 100 : 0;
  const otherLeavePercent = totalCapacity > 0 ? (otherLeaveHours / totalCapacity) * 100 : 0;

  // Get text color for the percentage based on utilization
  const getPercentageTextColor = () => {
    if (utilizationRate > 100) return 'text-red-600 font-bold';
    if (utilizationRate >= 95) return 'text-green-600 font-semibold';
    if (utilizationRate >= 80) return 'text-orange-600 font-semibold';
    if (utilizationRate >= 50) return 'text-blue-600 font-semibold';
    if (utilizationRate === 0) return 'text-muted-foreground';
    return 'text-muted-foreground font-semibold';
  };

  const percentageTextColor = getPercentageTextColor();

  // Colors for each segment
  const projectColor = '#3b82f6'; // blue for projects
  const annualLeaveColor = '#f97316'; // orange for annual leave
  const holidayColor = '#a855f7'; // purple for holidays
  const otherLeaveColor = '#6b7280'; // gray for other leave

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex-1 flex justify-center items-center gap-1">
        {/* Horizontal progress bar with segments */}
        <div className="relative">
          <div 
            className="w-16 h-3 rounded border border-border overflow-hidden bg-muted relative flex"
          >
            {utilizationPercentage <= 100 ? (
              /* Segmented bar for <= 100% */
              <>
                {projectPercent > 0 && (
                  <div 
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${projectPercent}%`,
                      backgroundColor: projectColor
                    }} 
                  />
                )}
                {annualLeavePercent > 0 && (
                  <div 
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${annualLeavePercent}%`,
                      backgroundColor: annualLeaveColor
                    }} 
                  />
                )}
                {holidayPercent > 0 && (
                  <div 
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${holidayPercent}%`,
                      backgroundColor: holidayColor
                    }} 
                  />
                )}
                {otherLeavePercent > 0 && (
                  <div 
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${otherLeavePercent}%`,
                      backgroundColor: otherLeaveColor
                    }} 
                  />
                )}
              </>
            ) : (
              /* For > 100% - show proportional segments, overflow in red */
              <>
                {/* Scale segments to fit in 100% width, then show overflow */}
                <div 
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(projectPercent / utilizationPercentage) * 100}%`,
                    backgroundColor: projectColor
                  }} 
                />
                <div 
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(annualLeavePercent / utilizationPercentage) * 100}%`,
                    backgroundColor: annualLeaveColor
                  }} 
                />
                <div 
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(holidayPercent / utilizationPercentage) * 100}%`,
                    backgroundColor: holidayColor
                  }} 
                />
                <div 
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(otherLeavePercent / utilizationPercentage) * 100}%`,
                    backgroundColor: otherLeaveColor
                  }} 
                />
                {/* Red overlay for overflow portion */}
                <div 
                  className="h-full transition-all duration-300 absolute right-0 top-0"
                  style={{
                    width: `${Math.min(((utilizationPercentage - 100) / utilizationPercentage) * 100, 50)}%`,
                    backgroundColor: '#ef4444',
                    opacity: 0.7
                  }} 
                />
              </>
            )}
          </div>
        </div>
        
        {/* Percentage text with color coding */}
        <span className={cn("text-[9px] font-medium min-w-[20px] text-center", percentageTextColor)}>
          {utilizationRate}%
        </span>
      </div>
    </div>
  );
};
