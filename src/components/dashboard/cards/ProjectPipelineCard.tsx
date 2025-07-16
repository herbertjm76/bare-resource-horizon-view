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
          {/* Health Score Display with Visual */}
          <div className="text-center mb-6">
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgb(229, 231, 235)"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke={score >= 70 ? "rgb(34, 197, 94)" : score >= 50 ? "rgb(234, 179, 8)" : "rgb(239, 68, 68)"}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{score}</span>
              </div>
            </div>
            <Badge className={`text-xs ${getStatusColor(healthStatus)}`}>
              {healthStatus}
            </Badge>
          </div>
          
          {/* Simplified Project Distribution */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-1"></div>
              <div className="text-lg font-bold text-gray-900">{projectStats.inProgress.count}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mx-auto mb-1"></div>
              <div className="text-lg font-bold text-gray-900">{projectStats.planning.count}</div>
              <div className="text-xs text-gray-500">Planning</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-1"></div>
              <div className="text-lg font-bold text-gray-900">{projectStats.complete.count}</div>
              <div className="text-xs text-gray-500">Done</div>
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