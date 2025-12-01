import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { BarChart3, TrendingUp } from 'lucide-react';
import { ProjectPipelineBubbleGraph } from './ProjectPipelineBubbleGraph';

interface ProjectPipelineCardProps {
  projects?: any[];
  maxScore?: number;
  timeRange?: string;
}

export const ProjectPipelineCard: React.FC<ProjectPipelineCardProps> = ({
  projects = [],
  maxScore = 100,
  timeRange = 'This Month'
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
  
  const totalProjects = projects.length;
  
  // Prepare bubble data using minimal theme colors
  const bubbleData = [
    {
      label: 'Active',
      count: projectStats.inProgress.count,
      color: 'hsl(var(--muted))',
      textColor: 'text-foreground'
    },
    {
      label: 'Planning',
      count: projectStats.planning.count,
      color: 'hsl(var(--theme-primary))',
      textColor: 'text-white'
    },
    {
      label: 'Complete',
      count: projectStats.complete.count,
      color: 'hsl(var(--theme-primary) / 0.7)',
      textColor: 'text-white'
    }
  ];
  
  return (
    <Card className="rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-theme-primary/10">
            <BarChart3 className="h-5 w-5 text-theme-primary" />
          </div>
          <span className="text-lg font-semibold text-theme-primary">Project Pipeline</span>
        </div>
        
        {/* Main content - flex-1 to fill remaining space */}
        <div className="flex-1 flex flex-col">
          {/* Bubble Graph - main content area without side legend */}
          <div className="flex-1 flex items-center justify-center">
            <ProjectPipelineBubbleGraph 
              bubbleData={bubbleData}
              totalProjects={totalProjects}
            />
          </div>
          
          {/* Bottom section with legend and time badge */}
          <div className="space-y-2 mt-2">
            {/* Legend - horizontal layout at bottom */}
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-muted"></div>
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-theme-primary"></div>
                <span className="text-sm text-muted-foreground">Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-theme-primary/70"></div>
                <span className="text-sm text-muted-foreground">Done</span>
              </div>
            </div>
            
            {/* Time range badge */}
            <div className="flex justify-center">
              <StandardizedBadge variant="secondary" size="sm">
                {timeRange}
              </StandardizedBadge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};