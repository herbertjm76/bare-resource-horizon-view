
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import type { Database } from '@/integrations/supabase/types';

type Project = {
  id: string;
  name: string;
  status: Database["public"]["Enums"]["project_status"];
  country?: string | null;
  code?: string | null;
  target_profit_percentage?: number | null;
  project_manager?: { first_name: string | null; last_name: string | null } | null;
  office?: { name: string | null; country: string | null } | null;
};

interface ProjectsTableProps {
  projects: Project[];
  loading: boolean;
  error?: string;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center p-8 border rounded-md border-dashed">
        Loading projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 border border-destructive/30 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
        {error}
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="text-center p-8 border rounded-md border-dashed">
        No projects found. Click "New Project" to create your first project.
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'default';
      case 'complete':
        return 'secondary';
      case 'on hold':
        return 'outline';
      case 'planning':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px] pl-6">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Office</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium pl-6">{project.name}</TableCell>
              <TableCell>
                {project.status && (
                  <Badge variant={getStatusBadgeVariant(project.status)}>
                    {project.status}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{project.country}</TableCell>
              <TableCell>{project.office?.name}</TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
