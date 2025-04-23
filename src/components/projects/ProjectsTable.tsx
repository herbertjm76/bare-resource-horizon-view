
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from '@/integrations/supabase/types';

// Define valid project statuses to match the database
type ProjectStatus = 'In Progress' | 'Not Started' | 'Completed' | 'On Hold';

// Define valid project stages to match the database
type ProjectStage = string; // Use string for flexibility, validation happens in UI

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
  const { 
    roles, 
    loading: rolesLoading, 
    locations,
    office_stages = []
  } = useOfficeSettings();

  // --- Color maps from DB ---
  const stageColorMap = useStageColorMap(office_stages);
  const areaColorMap = useAreaColorMap(locations);

  // --- Handle stage change ---
  const handleStageChange = async (projectId: string, newStage: ProjectStage) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ current_stage: newStage })
        .eq('id', projectId);
        
      if (error) {
        toast.error('Failed to update current stage', { description: error.message });
      } else {
        toast.success('Current stage updated');
      }
    } catch (err) {
      console.error('Error updating stage:', err);
      toast.error('An error occurred while updating the stage');
    }
  };

  // --- Handle status change ---
  const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);
        
      if (error) {
        toast.error('Failed to update status', { description: error.message });
      } else {
        toast.success('Status updated');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('An error occurred while updating the status');
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

  // Get status color based on status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'On Hold':
        return { bg: "#ccc9ff", text: "#212172" };
      case 'In Progress':
        return { bg: "#b3efa7", text: "#257e30" };
      case 'Completed':
        return { bg: "#eaf1fe", text: "#174491" };
      case 'Not Started':
        return { bg: "#ffe4e6", text: "#d946ef" };
      default:
        return { bg: "#E5DEFF", text: "#6E59A5" };
    }
  };

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
          {projects.map((project) => {
            const statusColor = getStatusColor(project.status);
            
            // Find the matching location for this project's country
            const matchingLocation = locations.find(loc => 
              loc.country === project.country || loc.code === project.country
            );
            
            // Get the area color for this project's country
            const areaColor = matchingLocation?.color || "#E5DEFF";
            
            // Get the correct code to display
            const areaCode = matchingLocation?.code || project.country;
            
            return (
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
                  {editMode ? (
                    <Select
                      defaultValue={project.status}
                      onValueChange={(value) => handleStatusChange(project.id, value as ProjectStatus)}
                    >
                      <SelectTrigger className="h-8 w-40">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span 
                      className="inline-block px-2 py-1 rounded"
                      style={{
                        background: statusColor.bg,
                        color: statusColor.text
                      }}
                    >
                      {project.status}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className="inline-block px-2 py-1 rounded font-semibold"
                    style={{
                      background: areaColor,
                      color: "#212172"
                    }}
                  >
                    {areaCode?.toUpperCase()}
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
                  {editMode ? (
                    <Select
                      defaultValue={project.current_stage}
                      onValueChange={(value) => handleStageChange(project.id, value)}
                    >
                      <SelectTrigger className="h-8 w-40">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {office_stages.map((stage) => (
                          <SelectItem 
                            key={stage.id} 
                            value={stage.name}
                          >
                            <div 
                              className="px-2 py-0.5 rounded w-full"
                              style={{
                                backgroundColor: stage.color || "#E5DEFF"
                              }}
                            >
                              {stage.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  )}
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;
