import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp } from 'lucide-react';

interface ProjectPipelineCardProps {
  score?: number;
  maxScore?: number;
  healthStatus?: string;
  projectStats?: {
    inProgress: { count: number; percentage: number };
    planning: { count: number; percentage: number };
    complete: { count: number; percentage: number };
  };
}

export const ProjectPipelineCard: React.FC<ProjectPipelineCardProps> = ({
  score = 62,
  maxScore = 100,
  healthStatus = "Moderate",
  projectStats = {
    inProgress: { count: 3, percentage: 6 },
    planning: { count: 50, percentage: 93 },
    complete: { count: 1, percentage: 2 }
  }
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'bg-green-500/20 text-green-400';
      case 'good':
        return 'bg-blue-500/20 text-blue-400';
      case 'moderate':
        return 'bg-orange-500/20 text-orange-400';
      case 'poor':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-orange-500/20 text-orange-400';
    }
  };

  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-white/70" />
            <span className="text-xs font-semibold text-white/90 tracking-wide">PROJECT PIPELINE</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Score display */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-orange-400">
              {score}<span className="text-lg text-white/60">/{maxScore}</span>
            </div>
            <p className="text-sm text-white/70">Pipeline Health Score</p>
            <Badge className={`text-xs ${getStatusColor(healthStatus)}`}>
              {healthStatus}
            </Badge>
          </div>
          
          {/* Project breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-blue-400" />
                <span className="text-sm text-white/80">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{projectStats.inProgress.count}</span>
                <span className="text-xs text-blue-400">{projectStats.inProgress.percentage}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-white/80">Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{projectStats.planning.count}</span>
                <span className="text-xs text-purple-400">{projectStats.planning.percentage}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-white/80">Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{projectStats.complete.count}</span>
                <span className="text-xs text-green-400">{projectStats.complete.percentage}%</span>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-2">
            <span className="text-xs text-white/60">This Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};