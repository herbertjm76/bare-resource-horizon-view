import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';

interface BurnRateIndicatorProps {
  projectId: string;
  projectName: string;
  budgetAmount: number;
  spentAmount: number;
  burnRate: number;
  runwayWeeks: number;
  utilizationRate: number;
  className?: string;
}

export const BurnRateIndicator: React.FC<BurnRateIndicatorProps> = ({
  projectId,
  projectName,
  budgetAmount,
  spentAmount,
  burnRate,
  runwayWeeks,
  utilizationRate,
  className
}) => {
  const budgetUtilization = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
  const remainingBudget = budgetAmount - spentAmount;
  
  const getStatusBadge = () => {
    if (budgetUtilization > 90) {
      return { text: 'Critical', variant: 'destructive' as const, icon: AlertTriangle };
    } else if (budgetUtilization > 75) {
      return { text: 'Warning', variant: 'outline' as const, icon: TrendingUp };
    } else if (budgetUtilization > 50) {
      return { text: 'On Track', variant: 'secondary' as const, icon: TrendingUp };
    } else {
      return { text: 'Healthy', variant: 'default' as const, icon: TrendingDown };
    }
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className={`${className} border-l-4 ${
      budgetUtilization > 90 ? 'border-l-red-500' :
      budgetUtilization > 75 ? 'border-l-orange-500' :
      budgetUtilization > 50 ? 'border-l-blue-500' : 'border-l-green-500'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm">{projectName}</span>
          </div>
          <Badge variant={status.variant} className="flex items-center gap-1">
            <StatusIcon className="w-3 h-3" />
            {status.text}
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Budget Utilization</span>
              <span>{budgetUtilization.toFixed(1)}%</span>
            </div>
            <Progress value={budgetUtilization} className="h-2" />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-muted-foreground">Spent: {formatCurrency(spentAmount)}</span>
              <span className="text-muted-foreground">Budget: {formatCurrency(budgetAmount)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-muted-foreground">Burn Rate</div>
              <div className="font-medium">{formatCurrency(burnRate)}/week</div>
            </div>
            <div>
              <div className="text-muted-foreground">Runway</div>
              <div className="font-medium">{runwayWeeks.toFixed(1)} weeks</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-muted-foreground">Remaining</div>
              <div className="font-medium">{formatCurrency(remainingBudget)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Utilization</div>
              <div className="font-medium">{utilizationRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};