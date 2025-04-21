
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import type { Tables } from '@/integrations/supabase/types';

// Define the extended project interface to match the data structure from the API
interface ExtendedProject extends Tables<'projects'> {
  project_manager?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  office?: {
    name: string;
    country: string;
  } | null;
  team_composition?: any[];
}

interface ProjectsTableProps {
  projects: ExtendedProject[] | null;
  isLoading: boolean;
}

export const ProjectsTable = ({ projects, isLoading }: ProjectsTableProps) => {
  console.log('ProjectsTable render:', { projectsLength: projects?.length || 0, isLoading });
  
  if (isLoading) {
    return <LoadingState />;
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No projects found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project Name</TableHead>
          <TableHead>PM</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Target Profit (%)</TableHead>
          <TableHead>Ideal Average Rate</TableHead>
          <TableHead>Actual Average Rate</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Current Stage</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>
              {project.project_manager ? 
                `${project.project_manager.first_name || ''} ${project.project_manager.last_name || ''}`.trim() || 'Unassigned' :
                'Unassigned'
              }
            </TableCell>
            <TableCell>{project.country}</TableCell>
            <TableCell>{project.target_profit_percentage}%</TableCell>
            <TableCell>Calculating...</TableCell>
            <TableCell>Calculating...</TableCell>
            <TableCell>{project.status}</TableCell>
            <TableCell>{project.current_stage}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const LoadingState = () => (
  <div className="p-4">
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      ))}
    </div>
  </div>
);
