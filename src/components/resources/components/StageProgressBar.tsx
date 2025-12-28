import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface StageProgressBarProps {
  allocatedHours: number;
  budgetedHours: number;
  progressPercentage: number;
  isOverAllocated: boolean;
}

export const StageProgressBar: React.FC<StageProgressBarProps> = ({
  allocatedHours,
  budgetedHours,
  progressPercentage,
  isOverAllocated
}) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  
  const getProgressColor = () => {
    if (isOverAllocated) return 'bg-destructive';
    if (progressPercentage >= 90) return 'bg-warning';
    if (progressPercentage >= 75) return 'bg-secondary';
    return 'bg-primary';
  };

  const getTextColor = () => {
    if (isOverAllocated) return 'text-destructive';
    if (progressPercentage >= 90) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      <Clock className="h-3 w-3 text-white/70 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <Progress 
          value={Math.min(progressPercentage, 100)} 
          className="h-2 bg-white/20"
        />
        <div className={`text-xs mt-1 ${getTextColor()}`}>
          {formatAllocationValue(allocatedHours, budgetedHours, displayPreference)} / {formatAllocationValue(budgetedHours, budgetedHours, displayPreference)}
          {isOverAllocated && (
            <span className="text-destructive ml-1">
              (+{formatAllocationValue(allocatedHours - budgetedHours, budgetedHours, displayPreference)} over)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};