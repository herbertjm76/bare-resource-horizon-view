
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import type { FinancialMetrics } from '../../hooks/useProjectFinancialMetrics';

interface ProgressIndicatorsSectionProps {
  consumedHours: number;
  derivedBudgetHours: number;
  derivedBudgetAmount: number;
  financialMetrics?: FinancialMetrics;
}

export const ProgressIndicatorsSection: React.FC<ProgressIndicatorsSectionProps> = ({
  consumedHours,
  derivedBudgetHours,
  derivedBudgetAmount,
  financialMetrics
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Hours Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressIndicator
            label="Hours Used"
            current={consumedHours}
            total={derivedBudgetHours}
            unit="hrs"
            variant="hours"
          />
        </CardContent>
      </Card>

      {financialMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressIndicator
              label="Budget Spent"
              current={Number(financialMetrics.total_spent) || 0}
              total={derivedBudgetAmount}
              unit="$"
              variant="budget"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
