
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { NameCell } from './cells/NameCell';
import { ProjectCountCell } from './cells/ProjectCountCell';
import { CapacityBarCell } from './row/CapacityBarCell';
import { ReadOnlyLeaveCell } from './cells/ReadOnlyLeaveCell';

interface NewResourceTableRowProps {
  member: any;
  memberIndex: number;
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  viewMode?: 'compact' | 'expanded';
}

export const NewResourceTableRow: React.FC<NewResourceTableRowProps> = ({
  member,
  memberIndex,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  viewMode = 'compact'
}) => {
  const isExpanded = viewMode === 'expanded';
  const cellPadding = isExpanded ? 'py-3 px-3' : 'py-1 px-1';
  const textSize = isExpanded ? 'text-sm' : 'text-xs';
  const rowHeight = isExpanded ? 'h-14' : 'h-10';

  const weeklyCapacity = member.weekly_capacity || 40;
  const totalUsedHours = getMemberTotal(member.id);
  const projectCount = getProjectCount(member.id);
  const annualLeave = annualLeaveData[member.id] || 0;
  const holidayHours = holidaysData[member.id] || 0;
  const leaveDays = getWeeklyLeave(member.id);

  const utilizationPercentage = weeklyCapacity > 0 ? Math.round((totalUsedHours / weeklyCapacity) * 100) : 0;

  return (
    <TableRow className={`${memberIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 ${rowHeight}`}>
      <NameCell member={member} />
      
      <TableCell className={`text-center border-r ${cellPadding} ${textSize}`}>
        {member.office_location || '-'}
      </TableCell>
      
      <TableCell className={`text-center border-r ${cellPadding} ${textSize}`}>
        <span className={`inline-flex items-center justify-center rounded-full font-medium ${
          isExpanded ? 'w-10 h-7 text-sm' : 'w-8 h-6 text-xs'
        } bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700 border border-gray-200 shadow-sm`}>
          {weeklyCapacity}h
        </span>
      </TableCell>
      
      <ProjectCountCell projectCount={projectCount} />
      
      <TableCell className={`text-center border-r ${cellPadding} ${textSize}`}>
        <span className={`inline-flex items-center justify-center rounded-full font-medium ${
          isExpanded ? 'w-10 h-7 text-sm' : 'w-8 h-6 text-xs'
        } bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 shadow-sm`}>
          {totalUsedHours}h
        </span>
      </TableCell>
      
      <CapacityBarCell
        totalUsedHours={totalUsedHours}
        totalCapacity={weeklyCapacity}
      />
      
      <ReadOnlyLeaveCell 
        value={annualLeave} 
        leaveDays={leaveDays}
        leaveType="Annual Leave"
      />
      
      <ReadOnlyLeaveCell 
        value={holidayHours} 
        leaveDays={[]}
        leaveType="Holiday"
      />
      
      <TableCell className={`text-center border-r ${cellPadding} ${textSize}`}>
        <span className={`inline-flex items-center justify-center rounded font-medium ${
          isExpanded ? 'w-8 h-7 text-sm' : 'w-6 h-5 text-xs'
        } bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700 border border-gray-200 shadow-sm`}>
          -
        </span>
      </TableCell>
      
      <TableCell className={`text-center border-r ${cellPadding} ${textSize}`}>
        <span className={`inline-flex items-center justify-center rounded font-medium ${
          isExpanded ? 'px-3 h-7 text-sm' : 'px-2 h-5 text-xs'
        } bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700 border border-gray-200 shadow-sm`}>
          -
        </span>
      </TableCell>
      
      {projects.map((project) => {
        const allocationKey = `${member.id}:${project.id}`;
        const hours = allocationMap.get(allocationKey) || 0;
        
        return (
          <TableCell key={project.id} className={`text-center border-r ${cellPadding} ${textSize}`}>
            {hours > 0 && (
              <span className={`inline-flex items-center justify-center rounded font-medium ${
                isExpanded ? 'w-8 h-7 text-sm' : 'w-6 h-5 text-xs'
              } bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 border border-green-200 shadow-sm`}>
                {hours}
              </span>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
