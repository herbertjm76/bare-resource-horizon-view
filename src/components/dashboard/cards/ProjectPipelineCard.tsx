import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, FolderOpen, CheckCircle } from 'lucide-react';

interface ProjectPipelineCardProps {
  data: any;
}

export const ProjectPipelineCard: React.FC<ProjectPipelineCardProps> = ({
  data
}) => {
  // Mock pipeline data - replace with actual data from props
  const pipelineScore = 62;
  const projectStats = [
    { label: 'In Progress', count: 3, percentage: 6, color: '#3b82f6', icon: TrendingUp },
    { label: 'Planning', count: 50, percentage: 93, color: '#8b5cf6', icon: FolderOpen },
    { label: 'Complete', count: 1, percentage: 2, color: '#10b981', icon: CheckCircle }
  ];

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: '#10b981' };
    if (score >= 60) return { text: 'Moderate', color: '#f59e0b' };
    return { text: 'Needs Attention', color: '#ef4444' };
  };

  const healthStatus = getHealthStatus(pipelineScore);

  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20 h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-white/80" />
            <h3 className="text-sm font-semibold text-white/90 tracking-wide uppercase">
              PROJECT PIPELINE
            </h3>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Pipeline Health Score */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-white">
              {pipelineScore}
              <span className="text-lg text-white/60">/100</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-white/80">Pipeline Health Score</p>
              <div 
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${healthStatus.color}20`,
                  color: healthStatus.color 
                }}
              >
                {healthStatus.text}
              </div>
            </div>
          </div>
          
          {/* Project Status List */}
          <div className="space-y-3">
            {projectStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent 
                      className="h-4 w-4" 
                      style={{ color: stat.color }}
                    />
                    <span className="text-sm text-white/80">{stat.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">{stat.count}</span>
                    <span className="text-xs text-white/60">{stat.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <p className="text-xs text-white/60 text-center">This Month</p>
        </div>
      </CardContent>
    </Card>
  );
};