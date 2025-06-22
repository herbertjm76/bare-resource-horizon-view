
import React, { memo, useMemo } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NewResourceTableRow } from './NewResourceTableRow';
import { NewResourceSummaryRow } from './NewResourceSummaryRow';

interface StableNewResourceTableProps {
  members: any[];
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  otherLeaveData?: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  updateOtherLeave?: (memberId: string, hours: number, notes?: string) => Promise<boolean>;
  viewMode: 'compact' | 'expanded';
  selectedWeek?: Date;
}

// Memoize header separately to prevent re-renders
const TableHeaderMemo = memo(({ projects }: { projects: any[] }) => {
  const projectsKey = useMemo(() => projects.map(p => p.id).join(','), [projects]);
  
  return (
    <TableHeader key={projectsKey}>
      <TableRow className="bg-[#6465F0] hover:bg-[#6465F0] border-b-2 border-slate-200">
        <TableHead className="text-center font-semibold text-white sticky left-0 bg-[#6465F0] z-20 border-r border-white/20" style={{ width: 180, minWidth: 180 }}>
          Team Member
        </TableHead>
        
        <TableHead className="text-center font-semibold text-white bg-[#6465F0] border-r border-white/20" style={{ width: 200, minWidth: 200 }}>
          Weekly Utilization
        </TableHead>
        
        <TableHead className="text-center font-semibold text-white bg-[#6465F0] border-r border-white/20" style={{ width: 150, minWidth: 150 }}>
          Leave
        </TableHead>
        
        <TableHead className="text-center font-semibold text-white bg-[#6465F0] border-r border-white/20" style={{ width: 35, minWidth: 35 }}>
          #
        </TableHead>
        
        {projects.map((project) => (
          <TableHead 
            key={project.id} 
            className="text-center font-semibold text-white border-r border-white/20 bg-[#6465F0] relative"
            style={{ width: 35, minWidth: 35, height: 120 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="transform -rotate-90 whitespace-nowrap text-xs font-medium"
                style={{ 
                  transformOrigin: 'center',
                  maxWidth: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={`${project.code || project.name} - ${project.name}`}
              >
                {project.code || project.name}
              </div>
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
});

TableHeaderMemo.displayName = 'TableHeaderMemo';

// Memoize each row individually to prevent cascading re-renders
const MemoizedTableRow = memo(({ 
  member, 
  memberIndex, 
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  otherLeaveData,
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  updateOtherLeave,
  viewMode,
  selectedWeek 
}: {
  member: any;
  memberIndex: number;
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  otherLeaveData: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  updateOtherLeave?: (memberId: string, hours: number, notes?: string) => Promise<boolean>;
  viewMode: 'compact' | 'expanded';
  selectedWeek: Date;
}) => (
  <NewResourceTableRow
    key={member.id}
    member={member}
    memberIndex={memberIndex}
    projects={projects}
    allocationMap={allocationMap}
    annualLeaveData={annualLeaveData}
    holidaysData={holidaysData}
    otherLeaveData={otherLeaveData}
    getMemberTotal={getMemberTotal}
    getProjectCount={getProjectCount}
    getWeeklyLeave={getWeeklyLeave}
    updateOtherLeave={updateOtherLeave}
    viewMode={viewMode}
    selectedWeek={selectedWeek}
  />
), (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.member.id === nextProps.member.id &&
    prevProps.memberIndex === nextProps.memberIndex &&
    prevProps.projects.length === nextProps.projects.length &&
    prevProps.allocationMap === nextProps.allocationMap &&
    prevProps.annualLeaveData === nextProps.annualLeaveData &&
    prevProps.holidaysData === nextProps.holidaysData &&
    prevProps.otherLeaveData === nextProps.otherLeaveData &&
    prevProps.viewMode === nextProps.viewMode
  );
});

MemoizedTableRow.displayName = 'MemoizedTableRow';

export const StableNewResourceTable: React.FC<StableNewResourceTableProps> = memo(({
  members,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  otherLeaveData = {},
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  updateOtherLeave,
  viewMode,
  selectedWeek = new Date()
}) => {
  // Memoize container classes
  const containerClasses = useMemo(() => ({
    table: viewMode === 'compact' ? 'resource-table-compact weekly-table' : 'resource-table-expanded weekly-table',
    container: viewMode === 'compact' ? 'resource-table-compact-container' : 'resource-table-expanded-container'
  }), [viewMode]);

  // Memoize member keys to prevent re-renders when order changes
  const membersKey = useMemo(() => members.map(m => m.id).join(','), [members]);

  return (
    <div className={containerClasses.container} style={{ maxWidth: 'calc(100vw - 19rem)' }}>
      <div className="overflow-x-auto">
        <Table className={`${containerClasses.table} min-w-full`}>
          <TableHeaderMemo projects={projects} />
          <TableBody key={membersKey}>
            {members.map((member, index) => (
              <MemoizedTableRow
                key={member.id}
                member={member}
                memberIndex={index}
                projects={projects}
                allocationMap={allocationMap}
                annualLeaveData={annualLeaveData}
                holidaysData={holidaysData}
                otherLeaveData={otherLeaveData}
                getMemberTotal={getMemberTotal}
                getProjectCount={getProjectCount}
                getWeeklyLeave={getWeeklyLeave}
                updateOtherLeave={updateOtherLeave}
                viewMode={viewMode}
                selectedWeek={selectedWeek}
              />
            ))}
            <NewResourceSummaryRow
              projects={projects}
              allocationMap={allocationMap}
              members={members}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

StableNewResourceTable.displayName = 'StableNewResourceTable';
