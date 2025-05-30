
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { useWeeklyOverviewMetrics } from './WeeklyOverviewMetrics';

interface WeeklyExecutiveSummaryProps {
  selectedWeek: Date;
  summaryFormat: 'simple' | 'detailed';
}

export const WeeklyExecutiveSummary: React.FC<WeeklyExecutiveSummaryProps> = ({
  selectedWeek,
  summaryFormat
}) => {
  const { metrics } = useWeeklyOverviewMetrics({ selectedWeek });

  console.log('WeeklyExecutiveSummary render:', { summaryFormat, metricsLength: metrics.length });

  return (
    <div className="print:hidden">
      <StandardizedExecutiveSummary
        metrics={metrics}
        gradientType="purple"
        cardFormat={summaryFormat}
      />
    </div>
  );
};
