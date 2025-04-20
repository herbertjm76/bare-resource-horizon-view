
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
import { Edit } from "lucide-react";
import type { Tables } from '@/integrations/supabase/types';

interface ProjectsTableProps {
  projects: Tables<'projects'>[] | null;
  isLoading: boolean;
}

export const ProjectsTable = ({ projects, isLoading }: ProjectsTableProps) => {
  if (isLoading) {
    return <LoadingState />;
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
        {projects?.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>PM Name</TableCell>
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
