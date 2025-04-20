
import React from 'react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectsTable } from './ProjectsTable';
import { ProjectsToolbar } from './ProjectsToolbar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const ProjectsList = () => {
  const { projects, isLoading } = useProjects();

  return (
    <div className="space-y-4">
      <ProjectsToolbar />
      <div className="rounded-lg border bg-card text-card-foreground">
        <ProjectsTable projects={projects} isLoading={isLoading} />
      </div>
    </div>
  );
};
