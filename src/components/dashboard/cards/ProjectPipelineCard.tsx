import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  
  // Prepare bubble data for the bubble graph
  const bubbleData = [
    {
      label: 'Active',
      count: projectStats.inProgress.count,
      color: '#FDFDFD',
      textColor: 'text-gray-900'
    },
    {
      label: 'Planning',
      count: projectStats.planning.count,
      color: '#6B65F7',
      textColor: 'text-white'
    },
    {
      label: 'Complete',
      count: projectStats.complete.count,
      color: '#5A68F6',
      textColor: 'text-white'
    }
  ];
  
  return (
    <Card className="rounded-2xl bg-card-gradient-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-3 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-2">
          <BarChart3 className="h-3.5 w-3.5 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-700 tracking-wider">PROJECT PIPELINE</span>
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
                <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#6B65F7' }}></div>
                <span className="text-sm text-gray-600">Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#5A68F6' }}></div>
                <span className="text-sm text-gray-600">Done</span>
              </div>
            </div>
            
            {/* Time range badge */}
            <div className="flex justify-center">
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                {timeRange}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};