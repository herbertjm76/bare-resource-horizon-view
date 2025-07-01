
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
  return (
    <div className="workload-grid-container">
      <div className="workload-table-wrapper">
        <table 
          className="workload-grid-table enhanced-resource-table" 
          style={{
            minWidth: `${250 + (weekStartDates.length * 30) + 120}px`
          }}
        >
          <WorkloadCalendarHeader weekStartDates={weekStartDates} />
          
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
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
