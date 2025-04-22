
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectsToolbar from './ProjectsToolbar';
import ProjectsTable from './ProjectsTable';
import { useProjects } from '@/hooks/useProjects';

export const ProjectsList = () => {
  const { projects, isLoading, error } = useProjects();

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-2xl font-semibold mb-1.5">All Projects</CardTitle>
          <p className="text-sm text-muted-foreground">
            View and manage all your ongoing projects
          </p>
        </div>
        <ProjectsToolbar />
      </CardHeader>
      <CardContent className="pt-2">
        <ProjectsTable 
          projects={projects} 
          loading={isLoading} 
          error={error ? error.message : ''} 
        />
      </CardContent>
    </Card>
  );
};

export default ProjectsList;
