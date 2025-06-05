
import React from 'react';
import { TimeRange } from '../../TimeRangeSelector';
import { StandardizedBadge } from "@/components/ui/standardized-badge";

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
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="text-xs text-gray-500 space-y-0.5">
        <p><strong>Current Metrics ({getTimeRangeText()}):</strong></p>
        <div className="flex justify-between items-center">
          <span>Utilization:</span>
          <StandardizedBadge variant="status" className="text-xs">
            {utilizationRate}%
          </StandardizedBadge>
        </div>
        <div className="flex justify-between items-center">
          <span>Team:</span>
          <StandardizedBadge variant="status" className="text-xs">
            {teamSize} members
          </StandardizedBadge>
        </div>
        <div className="flex justify-between items-center">
          <span>Projects:</span>
          <StandardizedBadge variant="status" className="text-xs">
            {activeProjects}
          </StandardizedBadge>
        </div>
        <div className="flex justify-between items-center">
          <span>Load:</span>
          <StandardizedBadge variant="status" className="text-xs">
            {teamSize > 0 ? (activeProjects / teamSize).toFixed(1) : '0'} proj/person
          </StandardizedBadge>
        </div>
      </div>
    </div>
  );
};
