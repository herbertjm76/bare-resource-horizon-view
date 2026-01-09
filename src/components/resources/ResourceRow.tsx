
import React from 'react';
import { format } from 'date-fns';
import { useAllocationInput } from './hooks/useAllocationInput';
import { ResourceInfo } from './components/ResourceInfo';
import { AllocationInputCell } from './components/AllocationInputCell';

interface DayInfo {
  date: Date;
  label: string;
  dayName: string;
  monthLabel: string;
  isWeekend: boolean;
  isSunday: boolean;
  isFirstOfMonth: boolean;
  isEndOfWeek?: boolean;
}

interface ResourceRowProps {
  resource: {
    id: string;
    name: string;
    role: string;
    allocations?: Record<string, number>;
    isPending?: boolean;
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
  };
  days: DayInfo[];
  projectId: string;
  onAllocationChange: (resourceId: string, dayKey: string, hours: number) => void;
  onDeleteResource: (resourceId: string, globalDelete?: boolean) => void;
  onCheckOtherProjects?: (resourceId: string, resourceType: 'active' | 'pre_registered') => Promise<{ hasOtherAllocations: boolean; projectCount: number; }>;
  isEven?: boolean;
}

export const ResourceRow: React.FC<ResourceRowProps> = ({
  resource,
  days,
  projectId,
  onAllocationChange,
  onDeleteResource,
  onCheckOtherProjects,
  isEven = false
}) => {
  const resourceType = resource.isPending ? 'pre_registered' : 'active';
  
  const {
    allocations,
    inputValues,
    isLoading,
    isSaving,
    handleInputChange,
    handleInputBlur,
  } = useAllocationInput({
    projectId,
    resourceId: resource.id,
    resourceType,
    // Day inputs: treat 8h as 100% when displayPreference is percentage
    capacityHours: 8,
    onAllocationChange,
  });


  // Helper to get day key for allocation lookup
  const getDayKey = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  // Calculate total allocated hours across all days
  const totalAllocatedHours = Object.values(allocations).reduce((sum, hours) => sum + hours, 0);
  // Standard capacity would be 8 hours per workday
  const standardCapacity = days.filter(d => !d.isWeekend).length * 8;
  // Calculate utilization percentage
  const utilizationPercentage = standardCapacity > 0 
    ? (totalAllocatedHours / standardCapacity) * 100 
    : 0;

  // Base background color for project rows
  const rowBgClass = isEven 
    ? "bg-white" 
    : "bg-gray-50";

  return (
    <tr className={`border-b ${rowBgClass} group hover:bg-gray-50 h-7`}>
      {/* Fixed counter column */}
      <td className={`counter-column ${rowBgClass} p-0.5 group-hover:bg-gray-50`}></td>
      
      {/* Resource info column */}
      <ResourceInfo
        resource={resource}
        utilizationPercentage={utilizationPercentage}
        totalAllocatedHours={totalAllocatedHours}
        rowBgClass={rowBgClass}
        onDeleteResource={onDeleteResource}
        onCheckOtherProjects={onCheckOtherProjects}
      />
      
      {/* Allocation input cells - one for each day */}
      {days.map((day) => {
        const dayKey = getDayKey(day.date);
        const inputValue = inputValues[dayKey] || '';
        
        return (
          <AllocationInputCell
            key={dayKey}
            day={day}
            dayKey={dayKey}
            inputValue={inputValue}
            isLoading={isLoading}
            isSaving={isSaving}
            onInputChange={handleInputChange}
            onInputBlur={handleInputBlur}
          />
        );
      })}
    </tr>
  );
};
