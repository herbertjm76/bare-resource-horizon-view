import React from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';

interface ResourceAllocationCellProps {
  resourceId?: string;
  projectId?: string;
  hours: number;
  weekStartDate?: string;
  memberCapacity?: number;
  /** Sum of hours from OTHER projects (excluding this one) */
  totalOtherHours?: number;
  /** Total leave hours for this person/week */
  leaveHours?: number;
}

export const ResourceAllocationCell: React.FC<ResourceAllocationCellProps> = ({
  hours,
  memberCapacity,
}) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  const capacity = memberCapacity || workWeekHours;

  const displayValue = displayPreference === 'percentage' 
    ? `${Math.round((hours / capacity) * 100)}%` 
    : hours;

  const filledClass = hours > 0 ? 'leave-cell-filled' : '';

  return (
    <div className={`allocation-input-container w-full h-full ${filledClass}`}>
      <div className="w-full h-8 flex items-center justify-center text-lg font-medium">
        {hours > 0 ? displayValue : '—'}
      </div>
    </div>
  );
};
