
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

  // Transform metrics to match the Metric interface, removing any incompatible properties
  const transformedMetrics = metrics.map(metric => ({
    title: metric.title,
    value: metric.value,
    subtitle: metric.subtitle,
    badgeText: metric.badgeText,
    badgeColor: metric.badgeColor as 'green' | 'blue' | 'orange' | 'red' | 'gray' | 'purple' | undefined
  }));

  console.log('WeeklyExecutiveSummary render:', { metricsLength: transformedMetrics.length });

  return (
    <div className="print:hidden mb-4 w-full">
      <StandardizedExecutiveSummary
        metrics={transformedMetrics}
        gradientType="purple"
      />
    </div>
  );
};
