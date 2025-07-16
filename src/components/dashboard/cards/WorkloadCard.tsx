import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';

interface WorkloadCardProps {
  workloadData?: number[][];
  projects?: any[];
}

export const WorkloadCard: React.FC<WorkloadCardProps> = ({
  workloadData,
  projects = []
}) => {
  // Generate workload data based on actual projects if available
  const generateWorkloadFromProjects = () => {
    const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning');
    const totalProjects = activeProjects.length;
    const intensity = Math.min(totalProjects / 10, 1); // Scale to 0-1
    
    // Generate 4 months of data
    return Array.from({ length: 4 }, (_, monthIndex) => 
      Array.from({ length: 7 }, (_, dayIndex) => {
        // Vary intensity based on day and month
        const dayVariation = (dayIndex + 1) / 7;
        const monthVariation = (monthIndex + 1) / 4;
        return Math.min(intensity * dayVariation * monthVariation * (Math.random() * 0.5 + 0.5), 1);
      })
    );
  };
  
  const data = workloadData || generateWorkloadFromProjects();
  const months = ['Apr', 'May', 'Jun', 'Jul'];
  
  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-100';
    if (intensity <= 0.2) return 'bg-blue-200';
    if (intensity <= 0.4) return 'bg-blue-400';
    if (intensity <= 0.6) return 'bg-blue-500';
    if (intensity <= 0.8) return 'bg-blue-600';
    return 'bg-blue-700';
  };

  return (
    <Card className="rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-xs font-semibold text-gray-700 tracking-wide">WORKLOAD</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-between h-full">
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-700"></div>
            </div>
            <span>More</span>
          </div>
          
          {/* Month labels */}
          <div className="grid grid-cols-4 gap-4 text-xs text-gray-600 text-center">
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
                    className={`w-4 h-4 rounded-sm ${getIntensityColor(intensity)} transition-all duration-200 hover:scale-110`}
                  />
                ))}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <span className="text-xs text-gray-500">This Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};