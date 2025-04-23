import React, { useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// --- Load project stage and area colors from DB for rendering ---
const useStageColorMap = (stages: { id: string; color?: string; name: string }[]) => {
  const map: Record<string, string> = {};
  stages.forEach(stage => {
    map[stage.name] = stage.color || '#E5DEFF';
    map[stage.id] = stage.color || '#E5DEFF';
  });
  return map;
};
const useAreaColorMap = (areas: { code: string; color?: string; country: string }[]) => {
  const map: Record<string, string> = {};
  areas.forEach(area => {
    map[area.country] = area.color || '#E5DEFF';
    map[area.code] = area.color || '#E5DEFF';
  });
  return map;
};

interface ProjectsTableProps {
  projects: any[]; // It's ok, we handle all project prop shapes here
  loading: boolean;
  error?: string;
  editMode?: boolean;
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
  selectedProjects: string[];
  onSelectProject: (projectId: string) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ 
  projects, loading, error,
  editMode = false, onEdit, onDelete,
  selectedProjects, onSelectProject,
}) => {
  const { roles, loading: rolesLoading, locations, rates } = useOfficeSettings();

  // --- FAKE fetch project stages/areas for demo! ---
  const projectStages = []; // Replace by real fetch, or via props/context as needed
  const projectAreas = []; // As above

  // --- Demo-only color maps (will be populated by real fetch) ---
  const stageColorMap = useStageColorMap(projectStages);
  const areaColorMap = useAreaColorMap(projectAreas);

  // --- New: Track editable stage for a project ---
  const [editingStage, setEditingStage] = useState<{ [projectId: string]: boolean }>({});

  // --- Update current_stage in database on dropdown change ---
  const handleStageChange = async (projectId: string, newStage: string) => {
    // Optimistically update UI
    setEditingStage(prev => ({ ...prev, [projectId]: false }));
    const { error } = await supabase.from('projects').update({ current_stage: newStage }).eq('id', projectId);
    if (error) {
      toast.error('Failed to update current stage', { description: error.message });
    } else {
      toast.success('Current stage updated');
    }
  };

  if (loading || rolesLoading) {
    return <div className="text-center p-8 border rounded-md border-dashed">Loading projects...</div>;
  }
  if (error) {
    return <div className="p-8 border border-destructive/30 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">{error}</div>;
  }
  if (!projects?.length) {
    return <div className="text-center p-8 border rounded-md border-dashed">No projects found. Click "New Project" to create your first project.</div>;
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {editMode && <TableHead className="w-10"><span className="sr-only">Select</span></TableHead>}
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
            {editMode && <TableHead className="w-24">Actions</TableHead>}
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
              <TableCell>
                {project.project_manager?.first_name || '-'}
              </TableCell>
              <TableCell>
                {project.status && (
                  <span className={`inline-block px-2 py-1 rounded`} style={{
                    background: project.status === "On Hold"
                      ? "#ccc9ff" : project.status === "In Progress"
                      ? "#b3efa7" : project.status === "Complete"
                      ? "#eaf1fe" : project.status === "Planning"
                      ? "#ffe4e6" : "#E5DEFF",
                    color: project.status === "On Hold"
                      ? "#212172" : project.status === "In Progress"
                      ? "#257e30" : project.status === "Complete"
                      ? "#174491" : project.status === "Planning"
                      ? "#d946ef" : "#6E59A5"
                  }}>
                    {project.status}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <span
                  className="inline-block px-2 py-1 rounded font-semibold"
                  style={{
                    background: areaColorMap[project.country] || "#E5DEFF",
                    color: "#212172"
                  }}
                >
                  {project.country?.toUpperCase()}
                </span>
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
                {editMode
                  ? (
                    <select
                      className="bg-white border rounded px-2 py-1"
                      value={project.current_stage}
                      onChange={e => handleStageChange(project.id, e.target.value)}
                    >
                      {/* In real use, this should come from project.selectedStages/officeStages! */}
                      {/* We'll simulate with fixed example: */}
                      <option value="SD">Schematic</option>
                      <option value="DD">Design Development</option>
                      <option value="CD">Construction Docs</option>
                      <option value="CMP">Completion</option>
                    </select>
                  ) : (
                    <span
                      className="px-2 py-1 rounded"
                      style={{
                        backgroundColor: stageColorMap[project.current_stage] || "#E5DEFF",
                        color: "#212172"
                      }}
                    >
                      {project.current_stage}
                    </span>
                  )
                }
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
