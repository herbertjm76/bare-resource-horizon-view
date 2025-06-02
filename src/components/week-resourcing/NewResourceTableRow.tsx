
import React from 'react';
import { TableRow } from '@/components/ui/table';
import { 
  NameCell, 
  ProjectCountCell, 
  CapacityCell, 
  LeaveCell, 
  OfficeCell, 
  ProjectAllocationCell 
} from './NewResourceTableCells';

interface NewResourceTableRowProps {
  member: any;
  memberIndex: number;
  projects: any[];
  allocationMap: Map<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
}

export const NewResourceTableRow: React.FC<NewResourceTableRowProps> = ({
  member,
  memberIndex,
  projects,
  allocationMap,
  getMemberTotal,
  getProjectCount
}) => {
  const weeklyCapacity = member.weekly_capacity || 40;
  const totalHours = getMemberTotal(member.id);
  const projectCount = getProjectCount(member.id);
  const availableHours = Math.max(0, weeklyCapacity - totalHours);
  const isEvenRow = memberIndex % 2 === 0;
  
  return (
    <TableRow 
      key={member.id}
      className={`h-9 ${isEvenRow ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/50`}
    >
      <NameCell member={member} />
      <ProjectCountCell projectCount={projectCount} />
      <CapacityCell availableHours={availableHours} totalCapacity={weeklyCapacity} />
      <LeaveCell />
      <LeaveCell />
      <LeaveCell />
      <OfficeCell location={member.location} />
      
      {/* Project allocation cells */}
      {projects.slice(0, 15).map((project) => {
        const key = `${member.id}:${project.id}`;
        const hours = allocationMap.get(key) || 0;
        
        return (
          <ProjectAllocationCell 
            key={project.id}
            hours={hours}
            readOnly
          />
        );
      })}
      
      {/* Fill empty project columns if less than 15 */}
      {Array.from({ length: Math.max(0, 15 - projects.length) }).map((_, idx) => (
        <ProjectAllocationCell 
          key={`empty-${idx}`}
          hours={0}
          disabled
        />
      ))}
    </TableRow>
  );
};
