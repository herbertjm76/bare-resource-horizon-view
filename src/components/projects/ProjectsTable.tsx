
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
import { Input } from "@/components/ui/input";
import type { Database } from '@/integrations/supabase/types';

// Import the enum types from the database to ensure type safety
type DbProjectStage = Database["public"]["Enums"]["project_stage"]; // "BD" | "SD" | "DD" | "CD" | "CMP"
type DbProjectStatus = Database["public"]["Enums"]["project_status"]; // "In Progress" | "On Hold" | "Complete" | "Planning"

// Use our custom types for UI display that may differ from DB types
type ProjectStatus = 'In Progress' | 'Not Started' | 'Completed' | 'On Hold';

// Map UI status to DB status for data consistency
const mapStatusToDb = (status: ProjectStatus): DbProjectStatus => {
  switch(status) {
    case 'In Progress': return 'In Progress';
    case 'Completed': return 'Complete';
    case 'On Hold': return 'On Hold';
    case 'Not Started': 
    default:
      return 'Planning'; // Map "Not Started" to "Planning" in DB
  }
};

// Map DB status to UI status for display
const mapDbToStatus = (dbStatus: DbProjectStatus): ProjectStatus => {
  switch(dbStatus) {
    case 'In Progress': return 'In Progress';
    case 'Complete': return 'Completed';
    case 'On Hold': return 'On Hold';
    case 'Planning': 
    default:
      return 'Not Started'; // Map "Planning" to "Not Started" in UI
  }
};

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

// Add this function to map custom stage names to DB enum values safely
const mapCustomStageToDB = (stageName: string): DbProjectStage => {
  // This is a simple mapping based on stage name patterns
  // You might want to adjust this based on your specific naming conventions
  const lowerName = stageName.toLowerCase();
  if (lowerName.includes('bd') || lowerName.includes('business development')) return 'BD';
  if (lowerName.includes('sd') || lowerName.includes('schematic design')) return 'SD';
  if (lowerName.includes('dd') || lowerName.includes('design development')) return 'DD';
  if (lowerName.includes('cd') || lowerName.includes('construction document')) return 'CD';
  if (lowerName.includes('cmp') || lowerName.includes('complete')) return 'CMP';
  
  // Default to 'BD' if no match
  return 'BD';
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
  refetch: () => void; // Add refetch prop to refresh data
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ 
  projects, loading, error,
  editMode = false, onEdit, onDelete,
  selectedProjects, onSelectProject,
  refetch
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

  // State for editable fields
  const [editableFields, setEditableFields] = useState<Record<string, Record<string, any>>>({});

  // Initialize editable fields when projects change or edit mode is enabled
  useEffect(() => {
    if (projects.length > 0) {
      const fields: Record<string, Record<string, any>> = {};
      projects.forEach(project => {
        fields[project.id] = {
          name: project.name,
          code: project.code,
          profit: project.target_profit_percentage || 0,
          country: project.country
        };
      });
      setEditableFields(fields);
    }
  }, [projects, editMode]);

  // --- Handle field changes ---
  const handleFieldChange = (projectId: string, field: string, value: any) => {
    setEditableFields(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value
      }
    }));
  };

  // --- Handle field update ---
  const handleFieldUpdate = async (projectId: string, field: string, value: any) => {
    try {
      const updateData: Record<string, any> = {};
      
      switch(field) {
        case 'name':
          updateData.name = value;
          break;
        case 'code':
          updateData.code = value;
          break;
        case 'profit':
          updateData.target_profit_percentage = value;
          break;
        case 'country':
          updateData.country = value;
          break;
        default:
          break;
      }
      
      if (Object.keys(updateData).length === 0) return;
      
      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);
        
      if (error) {
        toast.error(`Failed to update ${field}`, { description: error.message });
      } else {
        toast.success(`${field} updated`);
        // Automatically refresh data after update
        refetch();
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      toast.error(`An error occurred while updating ${field}`);
    }
  };

  // --- Handle stage change --- (this is where the error was)
  const handleStageChange = async (projectId: string, newStage: string) => {
    try {
      // Convert custom stage name to a valid DB enum value
      const dbStage: DbProjectStage = mapCustomStageToDB(newStage);
      
      const { error } = await supabase
        .from('projects')
        .update({ current_stage: dbStage })
        .eq('id', projectId);
        
      if (error) {
        toast.error('Failed to update current stage', { description: error.message });
      } else {
        toast.success('Current stage updated');
        // Automatically refresh data after update
        refetch();
      }
    } catch (err) {
      console.error('Error updating stage:', err);
      toast.error('An error occurred while updating the stage');
    }
  };

  // --- Handle status change ---
  const handleStatusChange = async (projectId: string, uiStatus: ProjectStatus) => {
    try {
      // Map UI status to DB status
      const dbStatus = mapStatusToDb(uiStatus);
      
      const { error } = await supabase
        .from('projects')
        .update({ status: dbStatus })
        .eq('id', projectId);
        
      if (error) {
        toast.error('Failed to update status', { description: error.message });
      } else {
        toast.success('Status updated');
        // Automatically refresh data after update
        refetch();
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
            <TableHead>%Profit</TableHead>
            <TableHead>Current Stage</TableHead>
            {/* Display all stages as separate columns */}
            {office_stages.map((stage) => (
              <TableHead key={stage.id}>{stage.name}</TableHead>
            ))}
            {editMode && <TableHead className="w-24">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            // Convert DB status to UI status for display
            const uiStatus = mapDbToStatus(project.status as DbProjectStatus);
            const statusColor = getStatusColor(uiStatus);
            
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
                <TableCell className="font-semibold">
                  {editMode ? (
                    <Input
                      className="h-8 w-20"
                      value={editableFields[project.id]?.code || project.code}
                      onChange={(e) => handleFieldChange(project.id, 'code', e.target.value)}
                      onBlur={() => handleFieldUpdate(project.id, 'code', editableFields[project.id]?.code)}
                    />
                  ) : (
                    project.code
                  )}
                </TableCell>
                <TableCell>
                  {editMode ? (
                    <Input
                      className="h-8 w-full"
                      value={editableFields[project.id]?.name || project.name}
                      onChange={(e) => handleFieldChange(project.id, 'name', e.target.value)}
                      onBlur={() => handleFieldUpdate(project.id, 'name', editableFields[project.id]?.name)}
                    />
                  ) : (
                    <span className="font-bold">{project.name}</span>
                  )}
                </TableCell>
                <TableCell>
                  {project.project_manager?.first_name || '-'}
                </TableCell>
                <TableCell>
                  {editMode ? (
                    <Select
                      defaultValue={uiStatus}
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
                      className="inline-block px-2 py-1 rounded text-xs"
                      style={{
                        background: statusColor.bg,
                        color: statusColor.text
                      }}
                    >
                      {uiStatus}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editMode ? (
                    <Select
                      defaultValue={project.country}
                      onValueChange={(value) => handleFieldUpdate(project.id, 'country', value)}
                    >
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem 
                            key={location.code} 
                            value={location.country}
                          >
                            <div 
                              className="px-2 py-0.5 rounded w-full"
                              style={{
                                backgroundColor: location.color || "#E5DEFF"
                              }}
                            >
                              {location.code?.toUpperCase()} - {location.country}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span
                      className="inline-block px-2 py-1 rounded"
                      style={{
                        background: areaColor,
                        color: "#212172"
                      }}
                    >
                      {areaCode?.toUpperCase()}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editMode ? (
                    <Input
                      className="h-8 w-20"
                      type="number"
                      value={editableFields[project.id]?.profit || project.target_profit_percentage || 0}
                      onChange={(e) => handleFieldChange(project.id, 'profit', parseFloat(e.target.value))}
                      onBlur={() => handleFieldUpdate(project.id, 'profit', editableFields[project.id]?.profit)}
                    />
                  ) : (
                    project.target_profit_percentage != null ? `${project.target_profit_percentage}%` : "--"
                  )}
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
                        {/* Show stages from office_stages */}
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
                {/* Render stage columns with checkbox or indicator */}
                {office_stages.map((stage) => {
                  const isCurrentStage = project.current_stage === stage.name;
                  return (
                    <TableCell key={`${project.id}-${stage.id}`} className="text-center">
                      {isCurrentStage ? (
                        <div 
                          className="h-3 w-3 rounded-full mx-auto"
                          style={{
                            backgroundColor: stage.color || "#E5DEFF"
                          }}
                        />
                      ) : null}
                    </TableCell>
                  );
                })}
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
