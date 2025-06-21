
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NewResourceRow } from './NewResourceRow';
import { NewResourceSummaryRow } from './NewResourceSummaryRow';

interface NewResourceTableProps {
  members: any[];
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: any[];
  holidaysData: any[];
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => number;
  viewMode: 'compact' | 'expanded';
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
  viewMode
}) => {
  const tableClassName = viewMode === 'compact' 
    ? 'resource-table-compact' 
    : 'resource-table-expanded';

  const containerClassName = viewMode === 'compact'
    ? 'resource-table-compact-container'
    : 'resource-table-expanded-container';

  return (
    <div className={containerClassName} style={{ maxWidth: 'calc(100vw - 19rem)' }}>
      <div className="overflow-x-auto">
        <Table className={`${tableClassName} min-w-full`}>
          <TableHeader>
            <TableRow className="bg-slate-50 border-b-2 border-slate-200">
              <TableHead className="w-12 text-center font-semibold text-slate-700 sticky left-0 bg-slate-50 z-10">
                #
              </TableHead>
              <TableHead className="w-48 font-semibold text-slate-700 sticky left-12 bg-slate-50 z-10">
                Team Member
              </TableHead>
              <TableHead className="w-20 text-center font-semibold text-slate-700">
                Capacity
              </TableHead>
              <TableHead className="w-20 text-center font-semibold text-slate-700">
                Leave
              </TableHead>
              <TableHead className="w-20 text-center font-semibold text-slate-700">
                Projects
              </TableHead>
              <TableHead className="w-20 text-center font-semibold text-slate-700">
                Total
              </TableHead>
              {projects.map((project) => (
                <TableHead 
                  key={project.id} 
                  className="w-16 text-center font-semibold text-slate-700 border-l border-slate-200"
                  title={project.name}
                >
                  <div className="truncate text-xs">
                    {project.code || project.name}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, index) => (
              <NewResourceRow
                key={member.id}
                member={member}
                projects={projects}
                allocationMap={allocationMap}
                index={index + 1}
                getMemberTotal={getMemberTotal}
                getProjectCount={getProjectCount}
                getWeeklyLeave={getWeeklyLeave}
                viewMode={viewMode}
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
