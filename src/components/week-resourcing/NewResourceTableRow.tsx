
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { NameCell } from './cells/NameCell';
import { ProjectCountCell } from './cells/ProjectCountCell';
import { CapacityBarCell } from './row/CapacityBarCell';
import { ReadOnlyLeaveCell } from './cells/ReadOnlyLeaveCell';
import { Badge } from '@/components/ui/badge';

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
  const rowHeight = isExpanded ? 'h-16' : 'h-10';

  const weeklyCapacity = member.weekly_capacity || 40;
  const totalUsedHours = getMemberTotal(member.id);
  const projectCount = getProjectCount(member.id);
  const annualLeave = annualLeaveData[member.id] || 0;
  const holidayHours = holidaysData[member.id] || 0;
  const leaveDays = getWeeklyLeave(member.id);

  const utilizationPercentage = weeklyCapacity > 0 ? Math.round((totalUsedHours / weeklyCapacity) * 100) : 0;

  // Enhanced member name cell for expanded view
  const renderNameCell = () => {
    if (isExpanded) {
      return (
        <TableCell className={`border-r ${cellPadding} ${textSize} min-w-[150px]`}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <NameCell member={member} />
            </div>
            <div className="flex flex-wrap gap-1 text-xs text-gray-500">
              {member.office_location && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {member.office_location}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs px-1 py-0">
                {weeklyCapacity}h capacity
              </Badge>
              {member.department && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {member.department}
                </Badge>
              )}
            </div>
          </div>
        </TableCell>
      );
    }
    
    return <NameCell member={member} />;
  };

  // Enhanced utilization cell for expanded view
  const renderUtilizationCell = () => {
    if (isExpanded) {
      return (
        <TableCell className={`text-center border-r ${cellPadding} ${textSize}`}>
          <span className={`inline-flex items-center justify-center rounded-full font-bold px-4 py-2 text-base ${
            utilizationPercentage > 100 
              ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-700 border border-red-300'
              : utilizationPercentage > 80
              ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300'
              : 'bg-gradient-to-br from-green-100 to-green-200 text-green-700 border border-green-300'
          } shadow-sm`}>
            {utilizationPercentage}%
          </span>
        </TableCell>
      );
    }
    
    return <CapacityBarCell totalUsedHours={totalUsedHours} totalCapacity={weeklyCapacity} />;
  };

  return (
    <TableRow className={`${memberIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 ${rowHeight}`}>
      {renderNameCell()}
      
      <ProjectCountCell projectCount={projectCount} />
      
      <TableCell className={`text-center border-r ${cellPadding} ${textSize}`}>
        <span className={`inline-flex items-center justify-center rounded-full font-medium ${
          isExpanded ? 'w-10 h-7 text-sm' : 'w-8 h-6 text-xs'
        } bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 shadow-sm`}>
          {totalUsedHours}h
        </span>
        {isExpanded && (
          <div className="text-xs text-gray-500 mt-1">
            of {weeklyCapacity}h
          </div>
        )}
      </TableCell>
      
      {renderUtilizationCell()}
      
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
