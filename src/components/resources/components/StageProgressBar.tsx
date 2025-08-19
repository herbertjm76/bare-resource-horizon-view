import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

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
          {allocatedHours}h / {budgetedHours}h
          {isOverAllocated && (
            <span className="text-destructive ml-1">
              (+{(allocatedHours - budgetedHours).toFixed(1)}h over)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};