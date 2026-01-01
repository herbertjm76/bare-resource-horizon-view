import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WeeklyWorkloadBreakdown } from '../hooks/types';
import { WorkloadTooltip } from './WorkloadTooltip';

interface WeekUtilizationCellProps {
  week: { date: Date; key: string };
  weekData: WeeklyWorkloadBreakdown | undefined;
  memberIndex: number;
}

export const WeekUtilizationCell: React.FC<WeekUtilizationCellProps> = ({
  week,
  weekData,
  memberIndex
}) => {
  const weekTotal = weekData?.total || 0;
  const rowBgColor = memberIndex % 2 === 0 ? '#ffffff' : '#f9fafb';
  
  // Color-coding based on utilization percentage (assuming 40h capacity)
  const weeklyCapacity = 40;
  const getUtilizationColor = (hours: number) => {
    if (hours === 0) return '#f3f4f6'; // Gray
    const utilization = (hours / weeklyCapacity) * 100;
    if (utilization > 100) return '#ef4444'; // Red - over-allocated
    if (utilization >= 80) return '#22c55e'; // Green - optimal (80-100%)
    if (utilization >= 50) return '#eab308'; // Yellow - moderate (50-79%)
    return '#f97316'; // Orange - underutilized (<50%)
  };

  return (
    <td 
      key={week.key} 
      className="workload-grid-cell week-cell"
      style={{ 
        width: '30px', 
        minWidth: '30px',
        maxWidth: '30px',
        backgroundColor: rowBgColor,
        textAlign: 'center',
        padding: '2px',
        borderRight: '1px solid rgba(156, 163, 175, 0.2)',
        borderBottom: '1px solid rgba(156, 163, 175, 0.2)',
        verticalAlign: 'middle'
      }}
    >
      {weekTotal > 0 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="utilization-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600',
                backgroundColor: getUtilizationColor(weekTotal),
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {weekTotal}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            className="max-w-xs bg-popover border shadow-lg p-3"
            side="top"
            align="center"
          >
            <WorkloadTooltip weekData={weekData} />
          </TooltipContent>
        </Tooltip>
      ) : (
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '500',
            backgroundColor: '#f3f4f6',
            color: '#9ca3af'
          }}
        >
          0
        </div>
      )}
    </td>
  );
};