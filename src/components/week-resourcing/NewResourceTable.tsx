
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NewResourceTableRow } from './NewResourceTableRow';
import { NewResourceSummaryRow } from './NewResourceSummaryRow';

interface NewResourceTableProps {
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

export const NewResourceTable: React.FC<NewResourceTableProps> = ({
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
  const tableClassName = viewMode === 'compact' 
    ? 'resource-table-compact weekly-table' 
    : 'resource-table-expanded weekly-table';

  const containerClassName = viewMode === 'compact'
    ? 'resource-table-compact-container'
    : 'resource-table-expanded-container';

  return (
    <div className={containerClassName} style={{ maxWidth: 'calc(100vw - 19rem)' }}>
      <div className="overflow-x-auto">
        <Table className={`${tableClassName} min-w-full`}>
          <TableHeader>
            <TableRow className="bg-[#6465F0] hover:bg-[#6465F0] border-b-2 border-slate-200">
              {/* Team Member Column */}
              <TableHead className="text-center font-semibold text-white sticky left-0 bg-[#6465F0] z-20 border-r border-white/20 text-sm" style={{ width: 180, minWidth: 180 }}>
                Team Member
              </TableHead>
              
              {/* Project Count Column - simplified header */}
              <TableHead className="text-center font-semibold text-white bg-[#6465F0] border-r border-white/20 text-sm" style={{ width: 80, minWidth: 80 }}>
                Total Hours
              </TableHead>
              
              {/* Project Columns with Rotated Text */}
              {projects.map((project) => (
                <TableHead 
                  key={project.id} 
                  className="text-center font-semibold text-white border-r border-white/20 bg-[#6465F0] relative text-sm"
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
};
