
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, Target } from 'lucide-react';
import type { FinancialMetrics } from '../../hooks/useProjectFinancialMetrics';

interface FinancialOverviewCardsProps {
  derivedBudgetAmount: number;
  consumedHours: number;
  derivedBudgetHours: number;
  financialMetrics?: FinancialMetrics;
}

export const FinancialOverviewCards: React.FC<FinancialOverviewCardsProps> = ({
  derivedBudgetAmount,
  consumedHours,
  derivedBudgetHours,
  financialMetrics
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Total Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${derivedBudgetAmount.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Calculated from stage fees
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Hours Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {consumedHours.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            of {derivedBudgetHours.toFixed(0)} budgeted hours
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Burn Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {financialMetrics?.burn_rate?.toFixed(1) || '0.0'}
          </div>
          <p className="text-xs text-muted-foreground">
            hours per day
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
