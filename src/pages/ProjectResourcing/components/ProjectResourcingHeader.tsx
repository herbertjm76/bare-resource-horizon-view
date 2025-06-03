
import React from 'react';
import { List, BarChart3, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectResourcingHeaderProps {
  projectCount: number;
  periodToShow: number;
}

export const ProjectResourcingHeader: React.FC<ProjectResourcingHeaderProps> = ({
  projectCount,
  periodToShow
}) => {
  return (
    <div className="flex items-center justify-between py-4">
      {/* Left side - Title with icon */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-violet rounded-lg flex items-center justify-center">
          <List className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Project Resourcing
        </h1>
      </div>

      {/* Right side - Metrics as rounded badges */}
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200 rounded-full px-4 py-2 text-sm font-medium">
          <BarChart3 className="h-4 w-4 mr-2" />
          {projectCount} Projects
        </Badge>
        <Badge variant="secondary" className="bg-green-50 text-green-600 border-green-200 rounded-full px-4 py-2 text-sm font-medium">
          <Clock className="h-4 w-4 mr-2" />
          {periodToShow} Weeks View
        </Badge>
      </div>
    </div>
  );
};
