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

  // Name Cell rendering (prominent, already handled nicely)
  const renderNameCell = () => (
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

  // Utilization Cell (right after name)
  const renderUtilizationCell = () => (
    <TableCell className={`text-center border-r ${cellPadding} ${textSize} min-w-[85px]`}>
      <span
        className={`inline-flex items-center justify-center rounded-full font-bold px-4 py-2 text-base expanded-util-pill ${getUtilizationPillClass()} shadow-sm`}
        style={isExpanded ? {} : { fontSize: '0.85rem', padding: '0.25rem 0.7rem' }}
      >
        {utilizationPercentage}%
      </span>
      {isExpanded && (
        <div className="text-xs text-gray-500 mt-1">
          <span>
            <span className="sr-only">Total:</span>
            {totalUsedHours}h / {weeklyCapacity}h
          </span>
        </div>
      )}
    </TableCell>
  );

  // Total hours cell
  const renderTotalCell = () => (
    <TableCell className={`text-center border-r ${cellPadding} ${textSize} min-w-[70px]`}>
      <span className={`inline-flex items-center justify-center rounded-full font-medium bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 shadow-sm px-4 py-2 text-base w-auto ${isExpanded ? '' : 'text-xs px-2 py-1'}`}>
        {totalUsedHours}h
      </span>
      {isExpanded && (
        <div className="text-xs text-gray-500 mt-1">
          <span>used</span>
        </div>
      )}
    </TableCell>
  );

  // Project block vertical divider (expanded only, thick left border for group)
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
      return (
        <TableCell
          key={project.id}
          className={`text-center border-r ${cellPadding} ${textSize} project-col-cell`}
          style={isExpanded ? { background: '#f6f9fd' } : undefined}
        >
          {hours > 0 && (
            <span className="inline-flex items-center justify-center rounded font-medium bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 border border-green-200 shadow-sm w-8 h-7 text-sm">
              {hours}
            </span>
          )}
        </TableCell>
      );
    });

  // Project Count, rendered after project columns
  const renderProjectCountCell = () => (
    <TableCell className={`text-center border-r ${cellPadding} ${textSize} min-w-[65px]`}>
      <span
        className={`inline-flex items-center justify-center rounded-full font-bold px-4 py-2 expanded-project-count-pill ${getProjectCountPillClass()} shadow-sm`}
        style={isExpanded ? {} : { fontSize: '0.85rem', padding: '2px 10px' }}
      >
        {projectCount}
      </span>
      {isExpanded && (
        <div className="text-xs text-gray-400 mt-1">projects</div>
      )}
    </TableCell>
  );

  // Leave/remarks cells: unchanged structure, but move after project assignments in expanded
  const leaveCells = [
    <ReadOnlyLeaveCell
      key="annual"
      value={annualLeave}
      leaveDays={leaveDays}
      leaveType="Annual Leave"
    />,
    <ReadOnlyLeaveCell
      key="holiday"
      value={holidayHours}
      leaveDays={[]}
      leaveType="Holiday"
    />,
    <TableCell key="other-leave" className={`text-center border-r ${cellPadding} ${textSize}`}>
      <span className={`inline-flex items-center justify-center rounded font-medium bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700 border border-gray-200 shadow-sm w-8 h-7 text-sm`}>
        -
      </span>
    </TableCell>,
    <TableCell key="remarks" className={`text-center border-r ${cellPadding} ${textSize}`}>
      <span className={`inline-flex items-center justify-center rounded font-medium bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700 border border-gray-200 shadow-sm px-3 h-7 text-sm`}>
        -
      </span>
    </TableCell>
  ];

  // Build ordered columns for expanded and compact views
  let cells: React.ReactNode[] = [];

  if (isExpanded) {
    cells = [
      renderNameCell(), // 1. Name
      renderUtilizationCell(), // 2. Utilization
      renderTotalCell(), // 3. Total
      renderProjectBlockSeparator(), // 4. Project block thick divider
      // 5. Project allocations
      ...renderProjectColumns(),
      // 6. Project count
      renderProjectCountCell(),
      // 7. Leave and remarks columns
      ...leaveCells
    ];
  } else {
    // Compact view = legacy order: Name, Count, Total, Utilization, Annual leave, Holiday, Other, Remarks, [Projects...]
    cells = [
      <NameCell key="name" member={member} />,
      <ProjectCountCell key="count" projectCount={projectCount} />,
      <TableCell key="total" className={`text-center border-r ${cellPadding} ${textSize}`}>
        <span className={`inline-flex items-center justify-center rounded-full font-medium w-8 h-6 text-xs bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 border border-blue-200 shadow-sm`}>
          {totalUsedHours}h
        </span>
      </TableCell>,
      <CapacityBarCell key="util" totalUsedHours={totalUsedHours} totalCapacity={weeklyCapacity} />,
      ...leaveCells,
      ...projects.map((project) => {
        const allocationKey = `${member.id}:${project.id}`;
        const hours = allocationMap.get(allocationKey) || 0;
        return (
          <TableCell key={project.id} className={`text-center border-r ${cellPadding} ${textSize}`}>
            {hours > 0 && (
              <span className={`inline-flex items-center justify-center rounded font-medium w-6 h-5 text-xs bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 border border-green-200 shadow-sm`}>
                {hours}
              </span>
            )}
          </TableCell>
        );
      }),
    ];
  }

  return (
    <TableRow className={`${memberIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 ${rowHeight}`}>
      {cells}
    </TableRow>
  );
};
