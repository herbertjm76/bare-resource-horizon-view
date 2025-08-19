import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Stage {
  id: string;
  stage_name: string;
  total_budget_amount?: number;
  allocated_hours?: number;
  remaining_hours?: number;
}

interface StageAllocationDropdownProps {
  stages: Stage[];
  selectedStageId?: string;
  onStageChange: (stageId: string) => void;
  className?: string;
}

export const StageAllocationDropdown: React.FC<StageAllocationDropdownProps> = ({
  stages,
  selectedStageId,
  onStageChange,
  className
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageStatus = (stage: Stage) => {
    if (!stage.allocated_hours || !stage.remaining_hours) return null;
    
    const utilization = (stage.allocated_hours / (stage.allocated_hours + stage.remaining_hours)) * 100;
    
    if (utilization > 90) return { text: 'High', variant: 'destructive' as const };
    if (utilization > 70) return { text: 'Med', variant: 'outline' as const };
    return { text: 'Low', variant: 'secondary' as const };
  };

  return (
    <Select value={selectedStageId} onValueChange={onStageChange}>
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder="Select stage" />
      </SelectTrigger>
      <SelectContent>
        {stages.map((stage) => {
          const status = getStageStatus(stage);
          return (
            <SelectItem key={stage.id} value={stage.id}>
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="font-medium">{stage.stage_name}</div>
                  {stage.total_budget_amount && (
                    <div className="text-xs text-muted-foreground">
                      Budget: {formatCurrency(stage.total_budget_amount)}
                    </div>
                  )}
                </div>
                {status && (
                  <Badge variant={status.variant} className="ml-2 text-xs">
                    {status.text}
                  </Badge>
                )}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};