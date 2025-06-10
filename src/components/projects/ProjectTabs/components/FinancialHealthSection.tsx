
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import type { FinancialMetrics } from '../../hooks/useProjectFinancialMetrics';

interface FinancialHealthSectionProps {
  financialMetrics: FinancialMetrics;
  form: any;
  derivedBudgetHours: number;
  consumedHours: number;
}

export const FinancialHealthSection: React.FC<FinancialHealthSectionProps> = ({
  financialMetrics,
  form,
  derivedBudgetHours,
  consumedHours
}) => {
  const getVarianceColor = (variance: number) => {
    if (variance > 10) return 'text-red-600';
    if (variance < -5) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'on track': return 'default';
      case 'at risk': return 'destructive';
      case 'delayed': return 'destructive';
      case 'over budget': return 'destructive';
      case 'under budget': return 'secondary';
      case 'completed': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Financial Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Budget Variance</span>
              <Badge variant={Math.abs(Number(financialMetrics.budget_variance) || 0) > 1000 ? 'destructive' : 'default'}>
                ${(Number(financialMetrics.budget_variance) || 0).toLocaleString()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {(Number(financialMetrics.budget_variance) || 0) > 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
              <span className={`text-sm ${getVarianceColor(Number(financialMetrics.budget_variance) || 0)}`}>
                {(Number(financialMetrics.budget_variance) || 0) > 0 ? 'Over budget' : 'Under budget'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Status</span>
              <Badge variant={getStatusBadgeVariant(form.financial_status)}>
                {form.financial_status || 'On Track'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Profit Margin: {(Number(financialMetrics.profit_margin) || 0).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold">
              {(Number(financialMetrics.consumed_hours) || 0).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Hours Consumed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {(Number(financialMetrics.budget_hours) || 0).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Budget Hours</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {derivedBudgetHours > 0 ? ((consumedHours / derivedBudgetHours) * 100).toFixed(1) : '0'}%
            </div>
            <div className="text-xs text-muted-foreground">Hours Utilization</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
