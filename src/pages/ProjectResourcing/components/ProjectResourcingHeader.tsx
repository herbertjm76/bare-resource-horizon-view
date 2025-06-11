
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface ProjectResourcingHeaderProps {
  projectCount: number;
  periodToShow: number;
}

export const ProjectResourcingHeader: React.FC<ProjectResourcingHeaderProps> = ({
  projectCount,
  periodToShow
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 text-brand-violet" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-violet">
          Project Resourcing
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5">
          <Calendar className="h-4 w-4 mr-2" />
          {projectCount} Projects
        </Badge>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1.5">
          <Clock className="h-4 w-4 mr-2" />
          {periodToShow} Weeks View
        </Badge>
      </div>
    </div>
  );
};
