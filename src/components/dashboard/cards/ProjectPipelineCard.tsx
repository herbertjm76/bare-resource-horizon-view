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
  
  // Calculate health score based on project distribution
  const calculateHealthScore = () => {
    const total = projects.length;
    if (total === 0) return 0;
    
    // Score based on project distribution and completion rate
    const completionRate = projectStats.complete.percentage;
    const activeRate = projectStats.inProgress.percentage;
    const planningRate = projectStats.planning.percentage;
    
    // Ideal distribution: some planning, good active projects, steady completion
    let score = 0;
    if (planningRate > 0 && planningRate < 70) score += 30; // Good planning pipeline
    if (activeRate > 20 && activeRate < 60) score += 40; // Good active work
    if (completionRate > 10) score += 30; // Good completion rate
    
    return Math.min(score, 100);
  };

  const score = calculateHealthScore();
  
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
        
        <div className="space-y-4">
          {/* Score display */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-orange-600">
              {score}<span className="text-lg text-gray-500">/{maxScore}</span>
            </div>
            <p className="text-sm text-gray-600">Pipeline Health Score</p>
            <Badge className={`text-xs ${getStatusColor(healthStatus)}`}>
              {healthStatus}
            </Badge>
          </div>
          
          {/* Project breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-blue-500" />
                <span className="text-sm text-gray-700">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{projectStats.inProgress.count}</span>
                <span className="text-xs text-blue-500">{projectStats.inProgress.percentage}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-700">Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{projectStats.planning.count}</span>
                <span className="text-xs text-purple-500">{projectStats.planning.percentage}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700">Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{projectStats.complete.count}</span>
                <span className="text-xs text-green-500">{projectStats.complete.percentage}%</span>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">This Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};