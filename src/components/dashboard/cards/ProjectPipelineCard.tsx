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
    <Card className="rounded-2xl border border-purple-500/20 shadow-lg hover:shadow-xl transition-shadow h-full" style={{ background: '#B18EC2' }}>
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-white/90" />
            <span className="text-xs font-semibold text-white/90 tracking-wide">PROJECT PIPELINE</span>
          </div>
        </div>
        
        {/* Main content - flex-1 to fill remaining space */}
        <div className="flex-1 flex flex-col">
          {/* Bubble Graph and Legend - main content area */}
          <div className="flex-1 flex items-center justify-between gap-3 mb-3">
            <div className="flex-1 h-full flex items-center justify-center">
              <ProjectPipelineBubbleGraph 
                bubbleData={bubbleData}
                totalProjects={totalProjects}
              />
            </div>
            
            {/* Legend - compact side layout */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FDFDFD', border: '1px solid #E5E7EB' }}></div>
                <span className="text-xs text-white/80">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6B65F7' }}></div>
                <span className="text-xs text-white/80">Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5A68F6' }}></div>
                <span className="text-xs text-white/80">Done</span>
              </div>
            </div>
          </div>
          
          {/* Time range badge at bottom */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs border-white/20 text-white/90 bg-white/10">
              {timeRange}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};