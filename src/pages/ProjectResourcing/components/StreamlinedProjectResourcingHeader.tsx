import React from 'react';
import { Calendar, BarChart3, Clock, Plus, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedWorkflowBreadcrumbs } from '@/components/workflow/EnhancedWorkflowBreadcrumbs';

interface StreamlinedProjectResourcingHeaderProps {
  projectCount: number;
  periodToShow: number;
  availableResources: number;
  overloadedResources: number;
  multiProjectResources: number;
}

export const StreamlinedProjectResourcingHeader: React.FC<StreamlinedProjectResourcingHeaderProps> = ({
  projectCount,
  periodToShow,
  availableResources,
  overloadedResources,
  multiProjectResources
}) => {
  const getPeriodLabel = (weeks: number): string => {
    if (weeks === 4) return '1 Month';
    if (weeks === 8) return '2 Months';
    if (weeks === 12) return '3 Months';
    return `${weeks} Weeks`;
  };

  return (
    <div className="space-y-4">
      {/* Consolidated breadcrumb and header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <EnhancedWorkflowBreadcrumbs />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-violet/10 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-brand-violet" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Project Resourcing
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Allocate team members across projects and track resource utilization
              </p>
            </div>
          </div>
        </div>
        
        {/* Primary action button */}
        <Button className="bg-brand-violet hover:bg-brand-violet/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Contextual metrics inline */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
          <BarChart3 className="h-3 w-3 mr-2" />
          {projectCount} Projects
        </Badge>
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
          <Clock className="h-3 w-3 mr-2" />
          {getPeriodLabel(periodToShow)} View
        </Badge>
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
          {availableResources} Available
        </Badge>
        {overloadedResources > 0 && (
          <Badge variant="destructive" className="px-3 py-1">
            {overloadedResources} Overloaded
          </Badge>
        )}
        {multiProjectResources > 0 && (
          <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1">
            {multiProjectResources} Multi-Project
          </Badge>
        )}
      </div>
    </div>
  );
};