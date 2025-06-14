
import React, { useRef, useEffect, useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { NewResourceTableHeader } from './NewResourceTableHeader';
import { NewResourceTableRow } from './NewResourceTableRow';

interface NewResourceTableProps {
  members: any[];
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  viewMode?: 'compact' | 'expanded';
}

export const NewResourceTable: React.FC<NewResourceTableProps> = ({
  members,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  viewMode = 'compact'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [tableWidth, setTableWidth] = useState<number>(0);

  // Calculate exact table width
  useEffect(() => {
    if (viewMode === 'compact') {
      // Fixed width calculation: name(180) + utilization(200) + leave(150) + count(35) = 565
      const baseWidth = 565;
      const projectWidth = projects.length * 35; // Each project column is 35px
      const totalWidth = baseWidth + projectWidth;
      setTableWidth(totalWidth);
    }
  }, [projects.length, viewMode]);

  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <p>No team members found for the selected week.</p>
      </div>
    );
  }

  if (viewMode === 'expanded') {
    return (
      <div className="w-full overflow-x-auto">
        <Table className="resource-table-expanded">
          <NewResourceTableHeader projects={projects} viewMode={viewMode} />
          <TableBody>
            {members.map((member, index) => (
              <NewResourceTableRow
                key={member.id}
                member={member}
                memberIndex={index}
                projects={projects}
                allocationMap={allocationMap}
                annualLeaveData={annualLeaveData}
                holidaysData={holidaysData}
                getMemberTotal={getMemberTotal}
                getProjectCount={getProjectCount}
                getWeeklyLeave={getWeeklyLeave}
                viewMode={viewMode}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Compact view with proper wrapping and centering
  return (
    <div className="w-full flex justify-center">
      <div 
        ref={containerRef}
        className="resource-table-compact-container"
        style={{
          width: `${tableWidth}px`,
          maxWidth: '100%',
          overflowX: 'auto'
        }}
      >
        <Table 
          ref={tableRef}
          className="resource-table-compact"
          style={{
            width: `${tableWidth}px`,
            minWidth: `${tableWidth}px`,
            tableLayout: 'fixed'
          }}
        >
          <NewResourceTableHeader projects={projects} viewMode={viewMode} />
          <TableBody>
            {members.map((member, index) => (
              <NewResourceTableRow
                key={member.id}
                member={member}
                memberIndex={index}
                projects={projects}
                allocationMap={allocationMap}
                annualLeaveData={annualLeaveData}
                holidaysData={holidaysData}
                getMemberTotal={getMemberTotal}
                getProjectCount={getProjectCount}
                getWeeklyLeave={getWeeklyLeave}
                viewMode={viewMode}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
