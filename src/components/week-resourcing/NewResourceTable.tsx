
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
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);

  // Calculate if horizontal scroll is needed
  useEffect(() => {
    if (!containerRef.current || !tableRef.current || viewMode !== 'compact') {
      return;
    }

    const checkScrollNeeded = () => {
      const containerWidth = containerRef.current?.clientWidth || 0;
      // Fixed width calculation: name(180) + utilization(200) + leave(150) + count(35) = 565
      const baseWidth = 565;
      const projectWidth = projects.length * 35; // Each project column is 35px
      const totalMinWidth = baseWidth + projectWidth;
      
      setNeedsHorizontalScroll(totalMinWidth > containerWidth);
    };

    checkScrollNeeded();
    
    const resizeObserver = new ResizeObserver(checkScrollNeeded);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [projects.length, viewMode]);

  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <p>No team members found for the selected week.</p>
      </div>
    );
  }

  const tableClasses = viewMode === 'expanded' 
    ? 'resource-table-expanded' 
    : 'resource-table-compact';

  const containerClasses = viewMode === 'compact'
    ? `dynamic-table-container ${needsHorizontalScroll ? 'has-horizontal-scroll' : 'fits-viewport'} resource-table-compact-container`
    : 'overflow-x-auto';

  // Calculate total table width for compact mode
  const totalTableWidth = viewMode === 'compact' 
    ? 565 + (projects.length * 35) // 180 + 200 + 150 + 35 + (projects * 35)
    : 'auto';

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      style={{
        overflowX: 'auto'
      }}
    >
      <Table 
        ref={tableRef}
        className={tableClasses}
        style={{
          width: totalTableWidth,
          minWidth: totalTableWidth,
          tableLayout: viewMode === 'compact' ? 'fixed' : 'auto'
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
  );
};
