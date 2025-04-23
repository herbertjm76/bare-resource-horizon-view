
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
import { Edit, Trash2 } from "lucide-react";
import type { Database } from '@/integrations/supabase/types';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';

type Project = {
  id: string;
  code?: string | null;
  name: string;
  status: Database["public"]["Enums"]["project_status"];
  country?: string | null;
  target_profit_percentage?: number | null;
  project_manager?: { first_name: string | null; last_name: string | null } | null;
  office?: { id: string; name: string | null; country: string | null } | null;
};

interface ProjectsTableProps {
  projects: Project[];
  loading: boolean;
  error?: string;
  editMode?: boolean;
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
  selectedProjects: string[];
  onSelectProject: (projectId: string) => void;
}

const statusColors: Record<string, string> = {
  "On Hold": "bg-[#ccc9ff] text-[#212172]",
  "In Progress": "bg-[#b3efa7] text-[#257e30]",
  "Complete": "bg-[#eaf1fe] text-[#174491]",
  "Planning": "bg-destructive/10 text-destructive",
};

const countryColors: Record<string, string> = {
  "KSA": "bg-[#d0f5a7] text-[#316d09]",
  "IT": "bg-[#d1e6ff] text-[#0050aa]",
  "OM": "bg-[#f1ffd2] text-[#6a7c28]",
  "LDN": "bg-[#f8ddff] text-[#991be1]",
};

const getPmFullName = (pm: Project["project_manager"]) =>
  pm ? [pm.first_name, pm.last_name].filter(Boolean).join(" ") : "-";

const getStatusStyles = (status: string) =>
  statusColors[status] || "bg-muted text-foreground";

const getCountryStyles = (country: string | null | undefined) =>
  (country && countryColors[country]) || "bg-muted text-foreground";

const getCountryAbbreviation = (country: string | null | undefined) => {
  if (!country) return "";
  const abbr = country.toUpperCase();
  if (abbr.length <= 3) return abbr;
  return abbr.slice(0, 3);
};

const ProjectsTable: React.FC<ProjectsTableProps> = ({ 
  projects, 
  loading, 
  error,
  editMode = false,
  onEdit,
  onDelete,
  selectedProjects,
  onSelectProject
}) => {
  const { roles, loading: rolesLoading } = useOfficeSettings();

  if (loading || rolesLoading) {
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
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {editMode && (
              <TableHead className="w-10">
                <span className="sr-only">Select</span>
              </TableHead>
            )}
            <TableHead className="w-20">Code</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>PM</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>%Profit</TableHead>
            <TableHead>AVG Rate</TableHead>
            <TableHead>Current Stage</TableHead>
            <TableHead>Stage Hours</TableHead>
            <TableHead>Stage Fee</TableHead>
            {editMode && (
              <TableHead className="w-24">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow 
              key={project.id} 
              className="align-middle"
              data-state={selectedProjects.includes(project.id) ? "selected" : undefined}
            >
              {editMode && (
                <TableCell>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded accent-[#6E59A5]"
                    checked={selectedProjects.includes(project.id)}
                    onChange={() => onSelectProject(project.id)}
                  />
                </TableCell>
              )}
              <TableCell className="font-semibold">{project.code}</TableCell>
              <TableCell>
                <span className="font-bold">{project.name}</span>
              </TableCell>
              <TableCell>{getPmFullName(project.project_manager)}</TableCell>
              <TableCell>
                {project.status && (
                  <span className={`inline-block px-2 py-1 rounded ${getStatusStyles(project.status)}`}>
                    {project.status}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {project.country && (
                  <span className={`inline-block px-2 py-1 rounded font-semibold ${getCountryStyles(project.country)}`}>
                    {getCountryAbbreviation(project.country)}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {/* Placeholder: Replace with real value if available */}
                82
              </TableCell>
              <TableCell>
                {project.target_profit_percentage != null ? `${project.target_profit_percentage}%` : "--"}
              </TableCell>
              <TableCell>
                {/* Placeholder: Replace with real value if available */}
                85
              </TableCell>
              <TableCell>
                {/* Current Stage - placeholder */}
                <span className="px-2 py-1 bg-[#E5DEFF] text-[#6E59A5] rounded">Concept</span>
              </TableCell>
              <TableCell>
                {/* Stage Hours - placeholder */}
                40
              </TableCell>
              <TableCell>
                {/* Stage Fee - placeholder */}
                $15,000
              </TableCell>
              {editMode && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onEdit?.(project.id)}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      onClick={() => onDelete?.(project.id)}
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
