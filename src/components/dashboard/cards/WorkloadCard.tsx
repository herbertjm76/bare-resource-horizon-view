import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';

interface WorkloadCardProps {
  workloadData?: number[][];
}

export const WorkloadCard: React.FC<WorkloadCardProps> = ({
  workloadData
}) => {
  // Generate sample workload data for heat map (4 months x 7 days)
  const defaultData = [
    [0.2, 0.3, 0.1, 0.4, 0.2, 0.1, 0.0], // Apr
    [0.4, 0.6, 0.3, 0.7, 0.5, 0.2, 0.1], // May  
    [0.3, 0.2, 0.8, 0.9, 0.6, 0.3, 0.1], // Jun
    [0.8, 0.9, 0.7, 0.9, 0.8, 0.4, 0.2], // Jul
  ];
  
  const data = workloadData || defaultData;
  const months = ['Apr', 'May', 'Jun', 'Jul'];
  
  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-white/10';
    if (intensity <= 0.2) return 'bg-blue-500/20';
    if (intensity <= 0.4) return 'bg-blue-500/40';
    if (intensity <= 0.6) return 'bg-blue-500/60';
    if (intensity <= 0.8) return 'bg-blue-500/80';
    return 'bg-blue-500';
  };

  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-white/70" />
            <span className="text-xs font-semibold text-white/90 tracking-wide">WORKLOAD</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-blue-500/20"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-500/60"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
            </div>
            <span>More</span>
          </div>
          
          {/* Month labels */}
          <div className="grid grid-cols-4 gap-4 text-xs text-white/70 text-center">
            {months.map(month => (
              <span key={month}>{month}</span>
            ))}
          </div>
          
          {/* Heat map grid */}
          <div className="grid grid-cols-4 gap-4">
            {data.map((monthData, monthIndex) => (
              <div key={monthIndex} className="grid grid-cols-4 gap-1">
                {monthData.map((intensity, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)} transition-all duration-200 hover:scale-110`}
                  />
                ))}
              </div>
            ))}
          </div>
          
          <div className="text-center pt-2">
            <span className="text-xs text-white/60">This Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};