
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { useWeeklyOverviewMetrics } from './WeeklyOverviewMetrics';

interface WeeklyExecutiveSummaryProps {
  selectedWeek: Date;
}

export const WeeklyExecutiveSummary: React.FC<WeeklyExecutiveSummaryProps> = ({
  selectedWeek
}) => {
  const { metrics } = useWeeklyOverviewMetrics({ selectedWeek });

  console.log('WeeklyExecutiveSummary render:', { metricsLength: metrics.length });

  return (
    <div className="print:hidden mb-4 w-full">
      <StandardizedExecutiveSummary
        metrics={metrics}
        gradientType="purple"
      />
    </div>
  );
};
