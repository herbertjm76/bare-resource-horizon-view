import React from 'react';
import { FolderOpen, Plus, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedWorkflowBreadcrumbs } from '@/components/workflow/EnhancedWorkflowBreadcrumbs';

interface StreamlinedProjectHeaderProps {
  totalProjects: number;
  activeProjects: number;
  completionRate: number;
  totalOffices: number;
  onNewProject: () => void;
}

export const StreamlinedProjectHeader: React.FC<StreamlinedProjectHeaderProps> = ({
  totalProjects,
  activeProjects,
  completionRate,
  totalOffices,
  onNewProject
}) => {
  return (
    <div className="space-y-4">
      {/* Consolidated breadcrumb and header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <EnhancedWorkflowBreadcrumbs />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-modern/10">
              <FolderOpen className="h-5 w-5" style={{ color: 'hsl(var(--theme-primary))' }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Project Setup & Planning
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Create and manage projects with integrated financial planning and team composition
              </p>
            </div>
          </div>
        </div>
        
        {/* Primary action button */}
        <Button onClick={onNewProject}>
          <Plus className="h-4 w-4 mr-2" />
          New Project Wizard
        </Button>
      </div>

      {/* Contextual metrics inline */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
          <BarChart3 className="h-3 w-3 mr-2" />
          {totalProjects} Total Projects
        </Badge>
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
          {activeProjects} Active
        </Badge>
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
          {completionRate}% Complete
        </Badge>
        <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1">
          {totalOffices} {totalOffices === 1 ? 'Office' : 'Offices'}
        </Badge>
      </div>
    </div>
  );
};