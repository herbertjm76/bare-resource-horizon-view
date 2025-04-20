
import React from 'react';
import { Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// This is mock data - we'll replace it with real data from Supabase later
const projects = [
  {
    id: 1,
    name: "Website Redesign",
    status: "In Progress",
    startDate: "2025-01-15",
    team: "Design Team",
    progress: 65,
  },
  {
    id: 2,
    name: "Mobile App Development",
    status: "Planning",
    startDate: "2025-02-01",
    team: "Development Team",
    progress: 25,
  },
  {
    id: 3,
    name: "Marketing Campaign",
    status: "Completed",
    startDate: "2024-12-01",
    team: "Marketing Team",
    progress: 100,
  },
];

export const ProjectsList = () => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  {project.name}
                </div>
              </TableCell>
              <TableCell>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                    project.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {project.status}
                </div>
              </TableCell>
              <TableCell>{project.startDate}</TableCell>
              <TableCell>{project.team}</TableCell>
              <TableCell>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
