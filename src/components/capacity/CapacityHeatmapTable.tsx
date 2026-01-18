import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown } from '@/components/workload/hooks/types';
import { WorkloadCalendarHeader } from '@/components/workload/components/WorkloadCalendarHeader';
import { WorkloadCalendarRow } from '@/components/workload/components/WorkloadCalendarRow';

interface CapacityHeatmapTableProps {
  members: TeamMember[];
  weeklyWorkloadData: Record<string, Record<string, WeeklyWorkloadBreakdown>>;
  weekStartDates: Array<{ date: Date; key: string }>;
}

export const CapacityHeatmapTable: React.FC<CapacityHeatmapTableProps> = ({
  members,
  weeklyWorkloadData,
  weekStartDates
}) => {
  // Always center align the table
  const shouldCenterAlign = true;
  
  // Calculate total table width: member column (250px) + week columns (30px each) + total column (120px)
  const tableWidth = 250 + (weekStartDates.length * 30) + 120;

  return (
    <TooltipProvider>
      <div 
        className="workload-resource-grid-container center-aligned"
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start',
          border: '1px solid hsl(var(--border))',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
      >
        <div className="workload-resource-table-wrapper" style={{ width: 'auto', maxWidth: '100%', overflow: 'visible' }}>
          <table 
            className="workload-resource-table"
            style={{ 
              width: shouldCenterAlign ? `${tableWidth}px` : '100%',
              minWidth: `${tableWidth}px`,
              borderCollapse: 'separate',
              borderSpacing: '0',
              background: 'hsl(var(--background))',
              borderRadius: '12px',
              overflow: 'hidden',
              margin: '0',
              tableLayout: 'fixed'
            }}
          >
            <WorkloadCalendarHeader 
              weekStartDates={weekStartDates} 
              shouldCenterAlign={shouldCenterAlign}
            />
            
            <tbody>
              {members.map((member, memberIndex) => {
                const memberWeeklyData = weeklyWorkloadData[member.id] || {};
                
                return (
                  <WorkloadCalendarRow
                    key={member.id}
                    member={member}
                    memberIndex={memberIndex}
                    weekStartDates={weekStartDates}
                    memberWeeklyData={memberWeeklyData}
                    shouldCenterAlign={shouldCenterAlign}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </TooltipProvider>
  );
};
