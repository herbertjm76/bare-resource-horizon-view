

import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from './CapacityBar';

interface NameCellProps {
  member: any;
}

export const NameCell: React.FC<NameCellProps> = ({ member }) => {
  return (
    <TableCell className="font-medium border-r bg-white sticky left-0 z-10 w-[150px]">
      <div className="truncate px-6" title={`${member.first_name} ${member.last_name}`}>
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
      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-300">
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
        className="w-8 h-6 text-xs text-center border-2 border-purple-300 rounded bg-purple-50 focus:border-purple-500 focus:bg-purple-100"
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
      <span className="inline-flex items-center justify-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-300 text-xs font-medium">
        {location || 'N/A'}
      </span>
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
      {readOnly || disabled ? (
        <span className="inline-flex items-center justify-center w-8 h-6 text-xs bg-gray-100 text-gray-700 rounded border border-gray-300 font-medium">
          {hours || ''}
        </span>
      ) : (
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
      )}
    </TableCell>
  );
};

