
import React from 'react';
import { Calendar, BarChart3, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';

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
    <StandardizedPageHeader
      title="Project Resourcing"
      description="Allocate team members across projects and track resource utilization"
      icon={Calendar}
    >
      <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-200 rounded-full px-4 py-2 text-sm font-medium">
        <BarChart3 className="h-4 w-4 mr-2" />
        {projectCount} Projects
      </Badge>
      <Badge variant="secondary" className="bg-green-50 text-green-600 border-green-200 rounded-full px-4 py-2 text-sm font-medium">
        <Clock className="h-4 w-4 mr-2" />
        {getPeriodLabel(periodToShow)} View
      </Badge>
    </StandardizedPageHeader>
  );
};
