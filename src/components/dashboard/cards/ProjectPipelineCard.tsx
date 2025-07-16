import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp } from 'lucide-react';

interface ProjectPipelineCardProps {
  projects?: any[];
  maxScore?: number;
}

export const ProjectPipelineCard: React.FC<ProjectPipelineCardProps> = ({
  projects = [],
  maxScore = 100
}) => {
  // Calculate project statistics from real data
  const calculateProjectStats = () => {
    const total = projects.length;
    if (total === 0) {
      return {
        inProgress: { count: 0, percentage: 0 },
        planning: { count: 0, percentage: 0 },
        complete: { count: 0, percentage: 0 }
      };
    }

    const inProgress = projects.filter(p => p.status === 'In Progress').length;
    const planning = projects.filter(p => p.status === 'Planning').length;
    const complete = projects.filter(p => p.status === 'Complete').length;

    return {
      inProgress: { 
        count: inProgress, 
        percentage: Math.round((inProgress / total) * 100) 
      },
      planning: { 
        count: planning, 
        percentage: Math.round((planning / total) * 100) 
      },
      complete: { 
        count: complete, 
        percentage: Math.round((complete / total) * 100) 
      }
    };
  };

  const projectStats = calculateProjectStats();
  
  // Fixed health score as requested
  const score = 62;
  
  const getHealthStatus = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Moderate";
    return "Needs Attention";
  };

  const healthStatus = getHealthStatus(score);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'moderate':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'needs attention':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const totalProjects = projects.length;
  
  return (
    <Card className="rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-gray-600" />
            <span className="text-xs font-semibold text-gray-700 tracking-wide">PROJECT PIPELINE</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-between h-full">
          {/* Total Projects Count */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">{totalProjects}</div>
            <div className="text-xs text-gray-500 font-medium">Total Projects</div>
          </div>
          
          {/* Bar Graph showing project distribution */}
          <div className="mb-6">
            <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
              {totalProjects > 0 ? (
                <>
                  {/* Done section */}
                  <div 
                    className="absolute left-0 top-0 h-full transition-all duration-500"
                    style={{ 
                      width: `${projectStats.complete.percentage}%`,
                      backgroundColor: '#5A68F6'
                    }}
                  />
                  {/* Planning section */}
                  <div 
                    className="absolute top-0 h-full transition-all duration-500"
                    style={{ 
                      left: `${projectStats.complete.percentage}%`,
                      width: `${projectStats.planning.percentage}%`,
                      backgroundColor: '#6B65F7'
                    }}
                  />
                  {/* Active section */}
                  <div 
                    className="absolute top-0 h-full transition-all duration-500"
                    style={{ 
                      left: `${projectStats.complete.percentage + projectStats.planning.percentage}%`,
                      width: `${projectStats.inProgress.percentage}%`,
                      backgroundColor: '#FDFDFD',
                      border: '1px solid #E5E7EB'
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
          </div>
          
          {/* Legend */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#FDFDFD', border: '1px solid #E5E7EB' }}></div>
                <span className="text-gray-600">Active</span>
              </div>
              <span className="font-semibold text-gray-900">{projectStats.inProgress.count}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#6B65F7' }}></div>
                <span className="text-gray-600">Planning</span>
              </div>
              <span className="font-semibold text-gray-900">{projectStats.planning.count}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#5A68F6' }}></div>
                <span className="text-gray-600">Done</span>
              </div>
              <span className="font-semibold text-gray-900">{projectStats.complete.count}</span>
            </div>
          </div>
          
          <div className="text-center">
            <span className="text-xs text-gray-500">This Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};