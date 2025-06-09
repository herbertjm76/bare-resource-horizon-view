
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NewResourceTableHeader } from './NewResourceTableHeader';
import { NewResourceTableRow } from './NewResourceTableRow';

interface NewResourceTableProps {
  projects: any[];
  members: any[];
  allocations: any[];
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  weekStartDate: string;
}

export const NewResourceTable: React.FC<NewResourceTableProps> = ({
  projects,
  members,
  allocations,
  annualLeaveData,
  holidaysData,
  weekStartDate
}) => {
  // Create allocation map for quick lookups
  const allocationMap = new Map();
  allocations.forEach(allocation => {
    const key = `${allocation.resource_id}:${allocation.project_id}`;
    allocationMap.set(key, allocation.hours);
  });

  const getMemberTotal = (memberId: string) => {
    return allocations
      .filter(a => a.resource_id === memberId)
      .reduce((sum, a) => sum + a.hours, 0);
  };

  const getProjectCount = (memberId: string) => {
    return allocations
      .filter(a => a.resource_id === memberId && a.hours > 0)
      .length;
  };

  return (
    <TooltipProvider>
      <div className="w-full border rounded-2xl shadow-lg mt-8 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
        {/* Simple single scrolling container */}
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <NewResourceTableHeader projects={projects} />
            
            <TableBody>
              {members.map((member, memberIndex) => (
                <NewResourceTableRow
                  key={member.id}
                  member={member}
                  memberIndex={memberIndex}
                  projects={projects}
                  allocationMap={allocationMap}
                  annualLeaveData={annualLeaveData}
                  holidaysData={holidaysData}
                  getMemberTotal={getMemberTotal}
                  getProjectCount={getProjectCount}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};
