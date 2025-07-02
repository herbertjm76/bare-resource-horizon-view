
import React from 'react';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown } from '../hooks/types';
import { WorkloadCalendarHeader } from './WorkloadCalendarHeader';
import { WorkloadCalendarRow } from './WorkloadCalendarRow';

interface WorkloadCalendarTableProps {
  members: TeamMember[];
  weeklyWorkloadData: Record<string, Record<string, WeeklyWorkloadBreakdown>>;
  weekStartDates: Array<{ date: Date; key: string }>;
}

export const WorkloadCalendarTable: React.FC<WorkloadCalendarTableProps> = ({
  members,
  weeklyWorkloadData,
  weekStartDates
}) => {
  // Calculate if we should center align (only for 12 weeks or less)
  const shouldCenterAlign = weekStartDates.length <= 12;
  
  // Calculate total table width: member column (250px) + week columns (30px each) + total column (120px)
  const tableWidth = 250 + (weekStartDates.length * 30) + 120;

  return (
    <div className={`workload-resource-grid-container ${shouldCenterAlign ? 'center-aligned' : ''}`}>
      <div className="workload-resource-table-wrapper">
        <table 
          className="workload-resource-table"
          style={{ 
            width: shouldCenterAlign ? `${tableWidth}px` : '100%',
            minWidth: `${tableWidth}px`,
            borderCollapse: 'separate',
            borderSpacing: '0',
            background: 'white',
            borderRadius: '8px',
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
  );
};
