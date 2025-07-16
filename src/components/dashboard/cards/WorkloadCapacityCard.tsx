import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';

interface WorkloadCapacityCardProps {
  data: any;
  selectedTimeRange: any;
}

export const WorkloadCapacityCard: React.FC<WorkloadCapacityCardProps> = ({
  data,
  selectedTimeRange
}) => {
  // Mock workload data - replace with actual data from props
  const workloadData = [
    [1, 2, 3, 1, 2],
    [3, 4, 2, 3, 1],
    [2, 1, 4, 2, 3],
    [1, 3, 2, 4, 1],
    [2, 4, 1, 3, 2]
  ];

  const months = ['Apr', 'May', 'Jun', 'Jul'];

  const getIntensityColor = (intensity: number) => {
    const colors = [
      'rgba(255, 255, 255, 0.1)', // 0 - very light
      'rgba(99, 102, 241, 0.3)',   // 1 - light blue
      'rgba(99, 102, 241, 0.5)',   // 2 - medium blue
      'rgba(99, 102, 241, 0.7)',   // 3 - darker blue
      'rgba(99, 102, 241, 0.9)'    // 4 - darkest blue
    ];
    return colors[intensity] || colors[0];
  };

  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20 h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-white/80" />
            <h3 className="text-sm font-semibold text-white/90 tracking-wide uppercase">
              WORKLOAD
            </h3>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>Less</span>
            <div className="flex items-center space-x-1">
              {[0, 1, 2, 3, 4].map((intensity) => (
                <div
                  key={intensity}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: getIntensityColor(intensity) }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
          
          {/* Month labels */}
          <div className="flex justify-between text-xs text-white/60 mb-2">
            {months.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="space-y-1">
            {workloadData.map((row, rowIndex) => (
              <div key={rowIndex} className="flex space-x-1">
                {row.map((intensity, colIndex) => (
                  <div
                    key={colIndex}
                    className="w-8 h-8 rounded-sm transition-colors"
                    style={{ backgroundColor: getIntensityColor(intensity) }}
                  />
                ))}
              </div>
            ))}
          </div>
          
          <p className="text-xs text-white/60 text-center">This Month</p>
        </div>
      </CardContent>
    </Card>
  );
};