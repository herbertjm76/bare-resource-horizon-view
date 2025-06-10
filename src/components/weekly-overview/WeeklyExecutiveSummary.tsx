
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { useWeeklyOverviewMetrics } from './WeeklyOverviewMetrics';

interface WeeklyExecutiveSummaryProps {
  selectedWeek: Date;
}

export const WeeklyExecutiveSummary: React.FC<WeeklyExecutiveSummaryProps> = ({
  selectedWeek
}) => {
  const { metrics, isLoading } = useWeeklyOverviewMetrics({ selectedWeek });

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="print:hidden mb-4 w-full">
      <StandardizedExecutiveSummary
        metrics={metrics}
        gradientType="purple"
        badgePosition="value"
      />
    </div>
  );
};
