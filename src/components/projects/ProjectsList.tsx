
import React from 'react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectsTable } from './ProjectsTable';
import { ProjectsToolbar } from './ProjectsToolbar';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle } from 'lucide-react';

export const ProjectsList = () => {
  const { projects, isLoading, error } = useProjects();

  if (error) {
    return (
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">Error loading projects</h3>
            <p className="text-muted-foreground mt-1">
              There was a problem loading your projects. Please try again.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProjectsToolbar />
      <div className="rounded-lg border bg-card text-card-foreground">
        <ProjectsTable projects={projects} isLoading={isLoading} />
      </div>
    </div>
  );
};
