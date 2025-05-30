
import React from 'react';
import { TimeRange } from '../../TimeRangeSelector';

interface MetricsSummaryProps {
  utilizationRate: number;
  teamSize: number;
  activeProjects: number;
  selectedTimeRange: TimeRange;
}

export const MetricsSummary: React.FC<MetricsSummaryProps> = ({
  utilizationRate,
  teamSize,
  activeProjects,
  selectedTimeRange
}) => {
  const getTimeRangeText = () => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return 'This Quarter';
      case '4months': return '4 Months';
      case '6months': return '6 Months';
      case 'year': return 'This Year';
      default: return 'Selected Period';
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Current Metrics ({getTimeRangeText()}):</strong></p>
        <div className="flex justify-between">
          <span>Utilization: {utilizationRate}%</span>
          <span>Team: {teamSize} members</span>
        </div>
        <div className="flex justify-between">
          <span>Projects: {activeProjects}</span>
          <span>Load: {teamSize > 0 ? (activeProjects / teamSize).toFixed(1) : '0'} proj/person</span>
        </div>
      </div>
    </div>
  );
};
