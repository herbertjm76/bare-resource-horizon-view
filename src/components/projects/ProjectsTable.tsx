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
}

const statusColors: Record<string, string> = {
  "On Hold": "bg-[#ccc9ff] text-[#212172]",        // light purple bg, dark purple text
  "In Progress": "bg-[#b3efa7] text-[#257e30]",    // light green bg, dark green text
  "Complete": "bg-[#eaf1fe] text-[#174491]",       // light blue bg, medium blue text
  "Planning": "bg-destructive/10 text-destructive",// fallback
};

const countryColors: Record<string, string> = {
  "KSA": "bg-[#d0f5a7] text-[#316d09]", // Green highlight for KSA
  "IT": "bg-[#d1e6ff] text-[#0050aa]",  // Blue for IT
  "OM": "bg-[#f1ffd2] text-[#6a7c28]",  // Light yellow for OM
  "LDN": "bg-[#f8ddff] text-[#991be1]", // Light purple for LDN
  // Add more mappings as needed
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
  if (abbr.length <= 3) return abbr; // already abbreviation
  // fallback: take first 3 letters uppercased (e.g. "Saudi Arabia" => SAU)
  return abbr.slice(0, 3);
};

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
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Code</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>PM</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>%Profit</TableHead>
            <TableHead>AVG Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="align-middle">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
