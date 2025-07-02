
import React from 'react';
import { Calendar, BarChart3, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectResourcingHeaderProps {
  projectCount: number;
  periodToShow: number;
}

export const ProjectResourcingHeader: React.FC<ProjectResourcingHeaderProps> = ({
  projectCount,
  periodToShow
}) => {
  // Convert weeks to month labels
  const getPeriodLabel = (weeks: number): string => {
    if (weeks === 4) return '1 Month';
    if (weeks === 12) return '3 Months';
    if (weeks === 52) return '12 Months';
    return `${weeks} Weeks`;
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
      {/* Left side - Title with icon */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Calendar className="h-7 w-7 text-primary" />
          Project Resourcing
        </h1>
      </div>

      {/* Right side - Metrics as rounded badges */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1.5 text-xs font-medium">
          <BarChart3 className="h-3 w-3 mr-1.5" />
          {projectCount} Projects
        </Badge>
        <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground border-secondary/20 rounded-full px-3 py-1.5 text-xs font-medium">
          <Clock className="h-3 w-3 mr-1.5" />
          {getPeriodLabel(periodToShow)} View
        </Badge>
      </div>
    </div>
  );
};
