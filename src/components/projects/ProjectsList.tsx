
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectsToolbar from './ProjectsToolbar';
import ProjectsTable from './ProjectsTable';
import { useProjects } from '@/hooks/useProjects';
import { ProjectFilters } from './ProjectFilters';

export const ProjectsList = () => {
  const { projects, isLoading, error } = useProjects();
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true; // Skip empty filters
        return project[key as keyof typeof project] === value;
      });
    });
  }, [projects, filters]);

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
      <CardContent>
        <ProjectFilters 
          onFilterChange={setFilters} 
          currentFilters={filters}
        />
        <ProjectsTable 
          projects={filteredProjects} 
          loading={isLoading} 
          error={error ? error.message : ''} 
        />
      </CardContent>
    </Card>
  );
};

export default ProjectsList;
