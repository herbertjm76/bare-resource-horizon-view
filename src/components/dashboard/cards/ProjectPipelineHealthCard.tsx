import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';
import { UnifiedDashboardData } from '../hooks/useDashboardData';

interface ProjectPipelineHealthCardProps {
  data: UnifiedDashboardData;
}

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'complete':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'in progress':
      return <TrendingUp className="h-4 w-4 text-blue-500" />;
    case 'on hold':
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    case 'planning':
      return <GitBranch className="h-4 w-4 text-purple-500" />;
    default:
      return <GitBranch className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'complete':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'on hold':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'planning':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getHealthScore = (projects: any[]) => {
  if (projects.length === 0) return 0;
  
  const statusWeights = {
    'complete': 100,
    'in progress': 80,
    'planning': 60,
    'on hold': 20
  };
  
  const totalScore = projects.reduce((sum, project) => {
    const weight = statusWeights[project.status?.toLowerCase() as keyof typeof statusWeights] || 50;
    return sum + weight;
  }, 0);
  
  return Math.round(totalScore / projects.length);
};

export const ProjectPipelineHealthCard: React.FC<ProjectPipelineHealthCardProps> = ({ data }) => {
  const projects = data.projects || [];
  const healthScore = getHealthScore(projects);
  
  // Group projects by status
  const projectsByStatus = projects.reduce((acc, project) => {
    const status = project.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusOrder = ['In Progress', 'Planning', 'On Hold', 'Complete'];
  const orderedStatuses = statusOrder.filter(status => projectsByStatus[status] > 0);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Healthy';
    if (score >= 60) return 'Moderate';
    return 'Needs Attention';
  };

  return (
    <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
            <GitBranch className="h-4 w-4 sm:h-5 sm:w-5" />
            Pipeline Health
          </h2>
          <StandardizedHeaderBadge>
            {projects.length} Projects
          </StandardizedHeaderBadge>
        </div>

        <div className="flex-1 space-y-4">
          {/* Health Score */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold mb-1">
              <span className={getHealthColor(healthScore)}>{healthScore}</span>
              <span className="text-gray-400 text-lg">/100</span>
            </div>
            <div className="text-sm text-gray-600">Pipeline Health Score</div>
            <div className={`text-xs mt-1 ${getHealthColor(healthScore)}`}>
              {getHealthLabel(healthScore)}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Project Status</h3>
            {orderedStatuses.length > 0 ? (
              <div className="space-y-2">
                {orderedStatuses.map(status => (
                  <div key={status} className="flex items-center justify-between p-2 bg-white border rounded-lg">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status)}
                      <span className="text-sm font-medium">{status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{projectsByStatus[status]}</span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(status)}`}>
                        {Math.round((projectsByStatus[status] / projects.length) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <GitBranch className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No projects found</p>
              </div>
            )}
          </div>

          {/* Key Metrics */}
          {projects.length > 0 && (
            <div className="pt-3 border-t">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {projectsByStatus['In Progress'] || 0}
                  </div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {projectsByStatus['Complete'] || 0}
                  </div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};