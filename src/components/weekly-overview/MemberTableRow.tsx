
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { formatNumber, calculateUtilization, calculateCapacity } from './utils';

interface MemberAllocation {
  id: string;
  annualLeave: number;
  publicHoliday: number;
  vacationLeave: number;
  medicalLeave: number;
  others: number;
  remarks: string;
  projects: string[];
  resourcedHours: number;
}

interface MemberTableRowProps {
  member: {
    id: string;
    first_name: string;
    last_name: string;
    location: string | null;
  };
  allocation: MemberAllocation;
  isEven: boolean;
  getOfficeDisplay: (locationCode: string) => string;
  onInputChange: (memberId: string, field: keyof MemberAllocation, value: any) => void;
}

export const MemberTableRow: React.FC<MemberTableRowProps> = ({
  member,
  allocation,
  isEven,
  getOfficeDisplay,
  onInputChange
}) => {
  const capacity = calculateCapacity(allocation.resourcedHours);
  const utilization = calculateUtilization(allocation.resourcedHours, 40);
  
  return (
    <TableRow className={isEven ? "bg-muted/10" : ""}>
      <TableCell className="py-1 px-4 name-column">
        <div className="flex items-center gap-2">
          <span>{member.first_name} {member.last_name}</span>
        </div>
      </TableCell>
      <TableCell className="py-1 px-4">{getOfficeDisplay(member.location || 'N/A')}</TableCell>
      <TableCell className="py-1 px-2 number-column">
        <div className="table-cell">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full h-full flex items-center justify-center">
                <span className="project-pill">{allocation.projects.length}</span>
              </TooltipTrigger>
              <TooltipContent side="right" className="w-64">
                <div className="p-1">
                  <strong>Projects:</strong>
                  <ul className="list-disc ml-4 mt-1">
                    {allocation.projects.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
      <TableCell className="py-1 px-2 text-center number-column bg-orange-400 text-white font-bold">
        <div className="table-cell">{capacity}</div>
      </TableCell>
      <TableCell className="py-1 px-2 number-column">
        <div className="table-cell">{formatNumber(utilization)}%</div>
      </TableCell>
      <TableCell className="py-1 px-2 bg-yellow-100 number-column">
        <div className="table-cell">{allocation.annualLeave}</div>
      </TableCell>
      <TableCell className="py-1 px-2 number-column">
        <div className="table-cell">{allocation.publicHoliday}</div>
      </TableCell>
      <TableCell className="py-1 px-2 number-column">
        <div className="table-cell">
          <input
            type="number"
            min="0"
            value={allocation.vacationLeave}
            onChange={(e) => onInputChange(member.id, 'vacationLeave', e.target.value)}
            className="editable-cell"
          />
        </div>
      </TableCell>
      <TableCell className="py-1 px-2 number-column">
        <div className="table-cell">
          <input
            type="number"
            min="0"
            value={allocation.medicalLeave}
            onChange={(e) => onInputChange(member.id, 'medicalLeave', e.target.value)}
            className="editable-cell"
          />
        </div>
      </TableCell>
      <TableCell className="py-1 px-2 number-column">
        <div className="table-cell">
          <input
            type="number"
            min="0"
            value={allocation.others}
            onChange={(e) => onInputChange(member.id, 'others', e.target.value)}
            className="editable-cell"
          />
        </div>
      </TableCell>
      <TableCell className="py-1 px-4">
        <Textarea 
          value={allocation.remarks}
          onChange={(e) => onInputChange(member.id, 'remarks', e.target.value)}
          className="min-h-0 h-6 p-1 text-xs resize-none"
        />
      </TableCell>
    </TableRow>
  );
};
