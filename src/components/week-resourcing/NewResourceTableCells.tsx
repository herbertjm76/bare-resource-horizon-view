
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
    <TableCell className="text-center border-r p-3 bg-gray-50/50">
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300 rounded-xl text-xs font-semibold text-purple-800 shadow-sm min-w-10 display-pill">
          {projectCount}
        </div>
      </div>
    </TableCell>
  );
};

interface CapacityCellProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityCell: React.FC<CapacityCellProps> = ({ availableHours, totalCapacity }) => {
  return (
    <TableCell className="border-r p-2 bg-gray-50/50">
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 shadow-sm min-w-10 display-pill">
          {availableHours}h
        </div>
      </div>
    </TableCell>
  );
};

interface LeaveCellProps {
  defaultValue?: string;
  type?: 'annual' | 'holiday' | 'other';
}

export const LeaveCell: React.FC<LeaveCellProps> = ({ defaultValue = "0", type = 'other' }) => {
  const getLeaveClasses = () => {
    switch (type) {
      case 'annual':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 text-blue-800';
      case 'holiday':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800';
      case 'other':
        return 'manual-input border-2 border-purple-300 bg-purple-50 focus:border-purple-500 focus:bg-purple-100';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 text-gray-700';
    }
  };

  if (type === 'other') {
    return (
      <TableCell className="text-center border-r p-3">
        <div className="flex items-center justify-center">
          <input
            type="number"
            min="0"
            max="40"
            defaultValue={defaultValue}
            className={`w-16 h-9 text-xs text-center rounded-xl transition-all font-medium ${getLeaveClasses()}`}
            placeholder="0"
          />
        </div>
      </TableCell>
    );
  }

  return (
    <TableCell className="text-center border-r p-3 bg-gray-50/50">
      <div className="flex items-center justify-center">
        <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm min-w-10 border display-pill ${getLeaveClasses()}`}>
          {defaultValue}h
        </div>
      </div>
    </TableCell>
  );
};

interface OfficeCellProps {
  location?: string;
}

export const OfficeCell: React.FC<OfficeCellProps> = ({ location }) => {
  return (
    <TableCell className="text-center border-r p-3 bg-gray-50/50">
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-green-100 to-green-200 border border-green-300 rounded-xl text-xs font-semibold text-green-800 shadow-sm min-w-10 display-pill">
          {location || 'N/A'}
        </div>
      </div>
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
  if (readOnly || disabled) {
    return (
      <TableCell className="border-r p-3 bg-gray-50/50">
        <div className="flex items-center justify-center">
          {hours > 0 ? (
            <div className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 shadow-sm min-w-10 display-pill">
              {hours}h
            </div>
          ) : (
            <div className="w-16 h-9"></div>
          )}
        </div>
      </TableCell>
    );
  }

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
