
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
    <div className="flex items-center justify-between">
      {/* Left side - Title and description */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <List className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Project Resourcing
          </h1>
          <p className="text-gray-600">
            Manage resource allocation and project planning
          </p>
        </div>
      </div>

      {/* Right side - Metrics */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <BarChart3 className="h-4 w-4 mr-2" />
          {projectCount} Projects
        </Badge>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Clock className="h-4 w-4 mr-2" />
          {periodToShow} Weeks View
        </Badge>
      </div>
    </div>
  );
};
