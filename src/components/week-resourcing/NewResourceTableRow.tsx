
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
  const cellPadding = isExpanded ? 'py-3 px-3' : 'py-2 px-1';
  const textSize = isExpanded ? 'text-sm' : 'text-xs';
  const rowHeight = isExpanded ? 'h-16' : 'h-12';

  const weeklyCapacity = member.weekly_capacity || 40;
  const totalUsedHours = getMemberTotal(member.id);
  const projectCount = getProjectCount(member.id);
  const annualLeave = annualLeaveData[member.id] || 0;
  const holidayHours = holidaysData[member.id] || 0;
  const leaveDays = getWeeklyLeave(member.id);

  const utilizationPercentage = weeklyCapacity > 0 ? Math.round((totalUsedHours / weeklyCapacity) * 100) : 0;

  // Utilization pill color
  const getUtilizationPillClass = () => {
    if (utilizationPercentage > 100)
      return 'pill-util-over bg-gradient-to-br from-red-100 to-red-200 text-red-700 border border-red-300';
    if (utilizationPercentage > 80)
      return 'pill-util-caution bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300';
    return 'pill-util-good bg-gradient-to-br from-green-100 to-green-200 text-green-700 border border-green-300';
  };

  // Project count pill color
  const getProjectCountPillClass = () =>
    'pill-project-count bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 border border-purple-300';

  // Enhanced Name Cell rendering for compact view
  const renderNameCell = () => (
    <TableCell className={`border-r ${cellPadding} ${textSize} min-w-[140px] max-w-[180px]`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <NameCell member={member} />
        </div>
        {!isExpanded && (
          <div className="flex flex-wrap gap-1 text-xs text-gray-500 ml-8">
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-600 border-blue-200">
              {weeklyCapacity}h
            </Badge>
            {member.office_location && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-gray-50 text-gray-600 border-gray-200">
                {member.office_location}
              </Badge>
            )}
          </div>
        )}
        {isExpanded && (
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
        )}
      </div>
    </TableCell>
  );

  // Compact project count cell
  const renderCompactProjectCountCell = () => (
    <TableCell className={`text-center border-r ${cellPadding} ${textSize} min-w-[50px] max-w-[60px]`}>
      <span
        className={`inline-flex items-center justify-center rounded-full font-bold text-xs ${getProjectCountPillClass()} shadow-sm`}
        style={{ fontSize: '0.75rem', padding: '4px 8px', minWidth: '24px', height: '20px' }}
      >
        {projectCount}
      </span>
    </TableCell>
  );

  // Compact total hours cell
  const renderCompactTotalCell = () => (
    <TableCell className={`text-center border-r ${cellPadding} ${textSize} min-w-[60px] max-w-[70px]`}>
      <span className="inline-flex items-center justify-center rounded-full font-medium bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 shadow-sm text-xs px-2 py-1 min-w-[32px] h-6">
        {totalUsedHours}h
      </span>
    </TableCell>
  );

  // Utilization Cell (capacity bar for compact, pill for expanded)
  const renderUtilizationCell = () => {
    if (isExpanded) {
      return (
        <TableCell className={`text-center border-r ${cellPadding} ${textSize} min-w-[85px]`}>
          <span
            className={`inline-flex items-center justify-center rounded-full font-bold px-4 py-2 text-base expanded-util-pill ${getUtilizationPillClass()} shadow-sm`}
          >
            {utilizationPercentage}%
          </span>
          <div className="text-xs text-gray-500 mt-1">
            <span>
              <span className="sr-only">Total:</span>
              {totalUsedHours}h / {weeklyCapacity}h
            </span>
          </div>
        </TableCell>
      );
    }
    
    // Compact view uses capacity bar
    return (
      <CapacityBarCell 
        totalUsedHours={totalUsedHours} 
        totalCapacity={weeklyCapacity}
        className={`${cellPadding} min-w-[90px]`}
      />
    );
  };

  // Total hours cell (expanded only)
  const renderExpandedTotalCell = () => (
    <TableCell className={`text-center border-r ${cellPadding} ${textSize} min-w-[70px]`}>
      <span className={`inline-flex items-center justify-center rounded-full font-medium bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 shadow-sm px-4 py-2 text-base w-auto`}>
        {totalUsedHours}h
      </span>
      <div className="text-xs text-gray-500 mt-1">
        <span>used</span>
      </div>
    </TableCell>
  );

  // Project block vertical divider (expanded only)
  const renderProjectBlockSeparator = () =>
    isExpanded ? (
      <TableCell
        className="project-block-sep-cell"
        style={{
          padding: 0,
          background: '#f3f4fd',
          borderRight: '4px solid #a5b4fc',
          minWidth: '0.5rem',
          width: '0.5rem'
        }}
        aria-hidden
      />
    ) : null;

  // Project columns (allocations)
  const renderProjectColumns = () =>
    projects.map((project) => {
      const allocationKey = `${member.id}:${project.id}`;
      const hours = allocationMap.get(allocationKey) || 0;
      const cellWidth = isExpanded ? 'min-w-[40px] max-w-[40px]' : 'min-w-[32px] max-w-[36px]';
      
      return (
        <TableCell
          key={project.id}
          className={`text-center border-r ${cellPadding} ${textSize} ${cellWidth} ${isExpanded ? 'project-col-cell' : ''}`}
          style={isExpanded ? { background: '#f6f9fd' } : undefined}
        >
          {hours > 0 && (
            <span 
              className="inline-flex items-center justify-center rounded font-medium bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 border border-green-200 shadow-sm text-xs"
              style={isExpanded ? { width: '32px', height: '28px' } : { width: '24px', height: '20px', fontSize: '0.7rem' }}
            >
              {hours}
            </span>
          )}
        </TableCell>
      );
    });

  // Project Count (expanded only)
  const renderExpandedProjectCountCell = () => (
    <TableCell className={`text-center border-r ${cellPadding} ${textSize} min-w-[65px]`}>
      <span
        className={`inline-flex items-center justify-center rounded-full font-bold px-4 py-2 expanded-project-count-pill ${getProjectCountPillClass()} shadow-sm`}
      >
        {projectCount}
      </span>
      <div className="text-xs text-gray-400 mt-1">projects</div>
    </TableCell>
  );

  // Leave cells with improved styling for compact view
  const renderLeaveCells = () => {
    const leaveSize = isExpanded ? 'text-sm' : 'text-xs';
    const leavePadding = isExpanded ? cellPadding : 'py-2 px-1';
    
    return [
      <ReadOnlyLeaveCell
        key="annual"
        value={annualLeave}
        leaveDays={leaveDays}
        leaveType="Annual Leave"
        className={`${leavePadding} ${leaveSize} ${isExpanded ? 'min-w-[60px]' : 'min-w-[45px]'}`}
      />,
      <ReadOnlyLeaveCell
        key="holiday"
        value={holidayHours}
        leaveDays={[]}
        leaveType="Holiday"
        className={`${leavePadding} ${leaveSize} ${isExpanded ? 'min-w-[60px]' : 'min-w-[45px]'}`}
      />,
      <TableCell key="other-leave" className={`text-center border-r ${leavePadding} ${leaveSize} ${isExpanded ? 'min-w-[60px]' : 'min-w-[45px]'}`}>
        <span 
          className="inline-flex items-center justify-center rounded font-medium bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700 border border-gray-200 shadow-sm text-xs"
          style={isExpanded ? { width: '32px', height: '28px' } : { width: '24px', height: '20px' }}
        >
          -
        </span>
      </TableCell>,
      <TableCell key="remarks" className={`text-center border-r ${leavePadding} ${leaveSize} ${isExpanded ? 'min-w-[60px]' : 'min-w-[50px]'}`}>
        <span 
          className="inline-flex items-center justify-center rounded font-medium bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700 border border-gray-200 shadow-sm text-xs"
          style={isExpanded ? { padding: '0.375rem 0.75rem', height: '28px' } : { padding: '0.25rem 0.5rem', height: '20px' }}
        >
          -
        </span>
      </TableCell>
    ];
  };

  // Build ordered columns for expanded and compact views
  let cells: React.ReactNode[] = [];

  if (isExpanded) {
    cells = [
      renderNameCell(), // 1. Name with details
      renderUtilizationCell(), // 2. Utilization pill
      renderExpandedTotalCell(), // 3. Total hours
      renderProjectBlockSeparator(), // 4. Project block divider
      ...renderProjectColumns(), // 5. Project allocations
      renderExpandedProjectCountCell(), // 6. Project count
      ...renderLeaveCells() // 7. Leave and remarks
    ];
  } else {
    // Compact view: Name, # Projects, Total, Capacity Bar, Leave columns, Project columns
    cells = [
      renderNameCell(), // 1. Name with compact info
      renderCompactProjectCountCell(), // 2. Project count
      renderCompactTotalCell(), // 3. Total hours
      renderUtilizationCell(), // 4. Capacity bar
      ...renderLeaveCells(), // 5. Leave and remarks
      ...renderProjectColumns() // 6. Project allocations
    ];
  }

  return (
    <TableRow className={`${memberIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 ${rowHeight}`}>
      {cells}
    </TableRow>
  );
};
