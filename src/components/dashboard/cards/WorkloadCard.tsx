import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';

interface WorkloadCardProps {
  workloadData?: number[][];
  projects?: any[];
}

interface WorkloadCardProps {
  workloadData?: number[][];
  projects?: any[];
  teamMembers?: any[];
  memberUtilizations?: any[];
}

export const WorkloadCard: React.FC<WorkloadCardProps> = ({
  workloadData,
  projects = [],
  teamMembers = [],
  memberUtilizations = []
}) => {
  // Use real team members or fallback to mock data
  const teamResources = teamMembers.length > 0 
    ? teamMembers.map(member => member.first_name || member.name || 'Unknown')
    : [
        'Sarah Chen',
        'Michael Rodriguez', 
        'Emma Thompson',
        'David Park',
        'Lisa Wang'
      ];

  // Generate 5 months of weekly data (current month + 4 months)
  const generateWeeklyWorkload = () => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    const weeksPerMonth = 4;
    
    return teamResources.map((resource, index) => {
      // Try to use real utilization data if available
      const memberUtilization = memberUtilizations[index];
      const baseUtilization = memberUtilization?.utilizationRate || Math.random() * 100;
      
      return Array.from({ length: months.length * weeksPerMonth }, () => {
        // Use real utilization with some variation for different weeks
        return Math.max(0, Math.min(100, baseUtilization + (Math.random() - 0.5) * 20));
      });
    });
  };

  const workloadMatrix = generateWeeklyWorkload();
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  
  const getIntensityColor = (intensity: number) => {
    if (intensity <= 20) return 'bg-green-200';
    if (intensity <= 40) return 'bg-yellow-200';
    if (intensity <= 60) return 'bg-orange-300';
    if (intensity <= 80) return 'bg-red-400';
    return 'bg-red-600';
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
          {/* Month headers */}
          <div className="grid grid-cols-6 gap-1 mb-2">
            <div className="text-xs text-gray-500"></div>
            {months.map(month => (
              <div key={month} className="text-xs text-gray-600 text-center font-medium">
                {month}
              </div>
            ))}
          </div>
          
          {/* Resource rows with weekly workload */}
          <div className="flex-1 space-y-1">
            {teamResources.map((resource, resourceIndex) => (
              <div key={resource} className="grid grid-cols-6 gap-1 items-center">
                <div className="text-xs text-gray-700 font-medium truncate pr-2">
                  {resource.split(' ')[0]}
                </div>
                {workloadMatrix[resourceIndex].map((intensity, weekIndex) => (
                  <div
                    key={weekIndex}
                    className={`h-6 rounded-sm ${getIntensityColor(intensity)} transition-all duration-200 hover:scale-105 relative group`}
                    title={`${Math.round(intensity)}% utilization`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-700 font-medium opacity-0 group-hover:opacity-100">
                        {Math.round(intensity)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-4 mb-2">
            <span>Low</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-green-200"></div>
              <div className="w-3 h-3 rounded-sm bg-yellow-200"></div>
              <div className="w-3 h-3 rounded-sm bg-orange-300"></div>
              <div className="w-3 h-3 rounded-sm bg-red-400"></div>
            </div>
            <span>High</span>
          </div>
          
          <div className="text-center">
            <span className="text-xs text-gray-500">This Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};