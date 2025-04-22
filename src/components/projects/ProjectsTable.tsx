
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
import { Edit, Trash } from "lucide-react";

interface ProjectsTableProps {
  projects: any[];
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px] pl-6">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium pl-6">{project.name}</TableCell>
              <TableCell>{project.status}</TableCell>
              <TableCell>{project.client}</TableCell>
              <TableCell>{project.dueDate}</TableCell>
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
