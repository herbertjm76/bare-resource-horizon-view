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
  
  // Theme-based alternating row colors
  const rowBgColor = memberIndex % 2 === 0 
    ? 'hsl(var(--background))' 
    : 'hsl(var(--theme-primary) / 0.02)';
  
  // Color-coding based on utilization percentage (assuming 40h capacity)
  const weeklyCapacity = 40;
  const getUtilizationColor = (hours: number) => {
    if (hours === 0) return 'hsl(var(--muted))';
    const utilization = (hours / weeklyCapacity) * 100;
    if (utilization > 100) return '#ef4444'; // Red - over-allocated
    if (utilization >= 80) return '#22c55e'; // Green - optimal (80-100%)
    if (utilization >= 50) return '#eab308'; // Yellow - moderate (50-79%)
    return '#f97316'; // Orange - underutilized (<50%)
  };

  return (
    <td 
      key={week.key} 
      className="workload-grid-cell week-cell group transition-colors"
      style={{ 
        width: '25px', 
        minWidth: '25px',
        maxWidth: '25px',
        backgroundColor: rowBgColor,
        textAlign: 'center',
        padding: '1px',
        borderRight: '1px solid hsl(var(--border) / 0.5)',
        borderBottom: '1px solid hsl(var(--border) / 0.3)',
        verticalAlign: 'middle'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--theme-primary) / 0.08)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = rowBgColor}
    >
      {weekTotal > 0 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="utilization-badge transition-transform hover:scale-110 hover:shadow-md"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '700',
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
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: '500',
            backgroundColor: 'hsl(var(--muted))',
            color: 'hsl(var(--muted-foreground))'
          }}
        >
          0
        </div>
      )}
    </td>
  );
};