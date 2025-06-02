
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NewResourceTableHeader } from './NewResourceTableHeader';
import { NewResourceTableRow } from './NewResourceTableRow';

interface NewResourceTableProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: string;
}

export const NewResourceTable: React.FC<NewResourceTableProps> = ({
  projects,
  members,
  allocations,
  weekStartDate
}) => {
  // Create allocation map for quick lookups
  const allocationMap = new Map();
  allocations.forEach(allocation => {
    const key = `${allocation.resource_id}:${allocation.project_id}`;
    allocationMap.set(key, allocation.hours);
  });

  // Calculate member totals
  const getMemberTotal = (memberId: string) => {
    return allocations
      .filter(a => a.resource_id === memberId)
      .reduce((sum, a) => sum + a.hours, 0);
  };

  // Calculate project count for member
  const getProjectCount = (memberId: string) => {
    return allocations
      .filter(a => a.resource_id === memberId && a.hours > 0)
      .length;
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-full overflow-hidden border rounded-md shadow-sm mt-8">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-max">
            <NewResourceTableHeader projects={projects} />
            
            <TableBody>
              {members.map((member, memberIndex) => (
                <NewResourceTableRow
                  key={member.id}
                  member={member}
                  memberIndex={memberIndex}
                  projects={projects}
                  allocationMap={allocationMap}
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
