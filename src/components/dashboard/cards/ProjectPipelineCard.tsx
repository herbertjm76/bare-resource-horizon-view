import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp } from 'lucide-react';
import { ProjectPipelineBubbleGraph } from './ProjectPipelineBubbleGraph';

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
    <Card className="rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-gray-600" />
            <span className="text-xs font-semibold text-gray-700 tracking-wide">PROJECT PIPELINE</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-between h-full">
          {/* Bubble Graph showing project distribution */}
          <div className="mb-4">
            <ProjectPipelineBubbleGraph 
              bubbleData={bubbleData}
              totalProjects={totalProjects}
            />
          </div>
          
          {/* Legend - smaller */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FDFDFD', border: '1px solid #E5E7EB' }}></div>
                <span className="text-gray-600">Active</span>
              </div>
              <span className="font-semibold text-gray-900">{projectStats.inProgress.count}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6B65F7' }}></div>
                <span className="text-gray-600">Planning</span>
              </div>
              <span className="font-semibold text-gray-900">{projectStats.planning.count}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5A68F6' }}></div>
                <span className="text-gray-600">Done</span>
              </div>
              <span className="font-semibold text-gray-900">{projectStats.complete.count}</span>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <span className="text-xs text-gray-500">This Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};