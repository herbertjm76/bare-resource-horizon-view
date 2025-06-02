import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from './CapacityBar';

interface NameCellProps {
  member: any;
}

export const NameCell: React.FC<NameCellProps> = ({ member }) => {
  return (
    <TableCell className="font-medium border-r bg-white sticky left-0 z-10 w-[200px]">
      <div className="truncate" title={`${member.first_name} ${member.last_name}`}>
        {member.first_name} {member.last_name}
      </div>
    </TableCell>
  );
};

interface ProjectCountCellProps {
  projectCount: number;
}

export const ProjectCountCell: React.FC<ProjectCountCellProps> = ({ projectCount }) => {
  return (
    <TableCell className="text-center border-r">
      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
        {projectCount}
      </span>
    </TableCell>
  );
};

interface CapacityCellProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityCell: React.FC<CapacityCellProps> = ({ availableHours, totalCapacity }) => {
  return (
    <TableCell className="border-r p-2">
      <CapacityBar 
        availableHours={availableHours} 
        totalCapacity={totalCapacity} 
      />
    </TableCell>
  );
};

interface LeaveCellProps {
  defaultValue?: string;
}

export const LeaveCell: React.FC<LeaveCellProps> = ({ defaultValue = "0" }) => {
  return (
    <TableCell className="text-center border-r">
      <input
        type="number"
        min="0"
        max="40"
        defaultValue={defaultValue}
        className="w-8 h-6 text-xs text-center border border-gray-300 rounded"
        placeholder="0"
      />
    </TableCell>
  );
};

interface OfficeCellProps {
  location?: string;
}

export const OfficeCell: React.FC<OfficeCellProps> = ({ location }) => {
  return (
    <TableCell className="text-center border-r text-xs text-gray-600">
      {location || 'N/A'}
    </TableCell>
  );
};

interface ProjectAllocationCellProps {
  hours: number;
  readOnly?: boolean;
  disabled?: boolean;
}

export const ProjectAllocationCell: React.FC<ProjectAllocationCellProps> = ({ 
  hours, 
  readOnly = false, 
  disabled = false 
}) => {
  return (
    <TableCell className="border-r p-1">
      <input
        type="number"
        min="0"
        max="40"
        value={hours || ''}
        className="w-8 h-6 text-xs text-center border border-gray-300 rounded"
        placeholder="0"
        readOnly={readOnly}
        disabled={disabled}
      />
    </TableCell>
  );
};
