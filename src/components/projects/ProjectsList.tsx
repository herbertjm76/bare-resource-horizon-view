
import React from 'react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectsTable } from './ProjectsTable';
import { ProjectsToolbar } from './ProjectsToolbar';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

export const ProjectsList = () => {
  const { projects, isLoading, error, refetch } = useProjects();
  
  console.log('ProjectsList render:', { 
    projectsLength: projects?.length || 0, 
    isLoading, 
    hasError: !!error 
  });

  const handleRetry = () => {
    console.log('Manually retrying projects fetch');
    refetch();
  };

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
            <Button variant="outline" className="mt-4" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-4">
        <ProjectsToolbar />
        <div className="rounded-lg border bg-card text-card-foreground p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            You don't have any projects yet. Create your first project to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProjectsToolbar />
      <div className="rounded-lg border bg-card text-card-foreground">
        <ProjectsTable projects={projects} isLoading={false} />
      </div>
    </div>
  );
};
