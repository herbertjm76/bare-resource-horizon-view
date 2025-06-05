
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from './CapacityBar';

interface NameCellProps {
  member: any;
}

export const NameCell: React.FC<NameCellProps> = ({ member }) => {
  return (
    <TableCell className="font-medium border-r bg-white sticky left-0 z-10 w-[150px] mobile-name-cell">
      <div className="truncate px-2 sm:px-6 text-xs sm:text-sm" title={`${member.first_name} ${member.last_name}`}>
        <span className="hidden sm:inline">{member.first_name} {member.last_name}</span>
        <span className="sm:hidden">{member.first_name.substring(0, 1)}. {member.last_name}</span>
      </div>
    </TableCell>
  );
};

interface ProjectCountCellProps {
  projectCount: number;
}

export const ProjectCountCell: React.FC<ProjectCountCellProps> = ({ projectCount }) => {
  return (
    <TableCell className="text-center border-r mobile-count-cell">
      <span className="inline-flex items-center justify-center w-4 h-4 sm:w-6 sm:h-6 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-300">
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
    <TableCell className="border-r p-1 sm:p-2 mobile-capacity-cell">
      <div className="hidden sm:block">
        <CapacityBar 
          availableHours={availableHours} 
          totalCapacity={totalCapacity} 
        />
      </div>
      <div className="sm:hidden text-xs text-center">
        <span className="text-green-600 font-medium">{availableHours}</span>
        <span className="text-gray-500">/</span>
        <span className="text-gray-700">{totalCapacity}</span>
      </div>
    </TableCell>
  );
};

interface LeaveCellProps {
  defaultValue?: string;
}

export const LeaveCell: React.FC<LeaveCellProps> = ({ defaultValue = "0" }) => {
  return (
    <TableCell className="text-center border-r mobile-leave-cell">
      <input
        type="number"
        min="0"
        max="40"
        defaultValue={defaultValue}
        className="w-6 h-5 sm:w-8 sm:h-6 text-xs text-center border-2 border-purple-300 rounded bg-purple-50 focus:border-purple-500 focus:bg-purple-100"
        placeholder="0"
      />
    </TableCell>
  );
};

interface OfficeCellProps {
  location?: string;
}

export const OfficeCell: React.FC<OfficeCellProps> = ({ location }) => {
  const displayLocation = location ? (location.length > 3 ? location.substring(0, 3) : location) : 'N/A';
  
  return (
    <TableCell className="text-center border-r text-xs text-gray-600 mobile-office-cell">
      <span className="inline-flex items-center justify-center px-1 sm:px-2 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-300 text-xs font-medium">
        <span className="hidden sm:inline">{location || 'N/A'}</span>
        <span className="sm:hidden">{displayLocation}</span>
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
    <TableCell className="border-r p-0.5 sm:p-1 mobile-project-cell">
      {readOnly || disabled ? (
        <span className="inline-flex items-center justify-center w-6 h-5 sm:w-8 sm:h-6 text-xs bg-gray-100 text-gray-700 rounded border border-gray-300 font-medium">
          {hours || ''}
        </span>
      ) : (
        <input
          type="number"
          min="0"
          max="40"
          value={hours || ''}
          className="w-6 h-5 sm:w-8 sm:h-6 text-xs text-center border border-gray-300 rounded"
          placeholder="0"
          readOnly={readOnly}
          disabled={disabled}
        />
      )}
    </TableCell>
  );
};

// Add mobile-specific styling
const mobileStyles = `
<style>
  .mobile-name-cell {
    min-width: 90px;
    max-width: 150px;
  }
  
  .mobile-count-cell,
  .mobile-leave-cell,
  .mobile-office-cell,
  .mobile-project-cell {
    min-width: 24px;
    max-width: 32px;
    padding: 2px 1px;
  }
  
  .mobile-capacity-cell {
    min-width: 60px;
    max-width: 80px;
  }
  
  @media (max-width: 768px) {
    .mobile-name-cell {
      min-width: 80px;
      max-width: 120px;
    }
    
    .mobile-count-cell,
    .mobile-leave-cell,
    .mobile-office-cell,
    .mobile-project-cell {
      min-width: 20px;
      max-width: 28px;
      padding: 1px;
    }
    
    .mobile-capacity-cell {
      min-width: 50px;
      max-width: 70px;
    }
  }
  
  @media (max-width: 480px) {
    .mobile-name-cell {
      min-width: 70px;
      max-width: 100px;
    }
    
    .mobile-count-cell,
    .mobile-leave-cell,
    .mobile-office-cell,
    .mobile-project-cell {
      min-width: 18px;
      max-width: 24px;
      padding: 1px;
    }
    
    .mobile-capacity-cell {
      min-width: 45px;
      max-width: 60px;
    }
  }
</style>
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = mobileStyles;
  document.head.appendChild(styleElement);
}
