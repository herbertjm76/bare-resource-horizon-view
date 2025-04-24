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
import type { Database } from '@/integrations/supabase/types';
import { EditableProjectField } from './components/EditableProjectField';
import { useStageColorMap, useAreaColorMap, getStatusColor } from './hooks/useProjectColors';
import { 
  mapStatusToDb, 
  mapDbToStatus, 
  mapCustomStageToDB,
  type ProjectStatus 
} from './utils/projectMappings';

interface ProjectsTableProps {
  projects: any[];
  loading: boolean;
  error?: string;
  editMode?: boolean;
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
  selectedProjects: string[];
  onSelectProject: (projectId: string) => void;
  refetch: () => void;
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

  const stageColorMap = useStageColorMap(office_stages);
  const areaColorMap = useAreaColorMap(locations);
  const [editableFields, setEditableFields] = useState<Record<string, Record<string, any>>>({});

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

  const handleFieldChange = (projectId: string, field: string, value: any) => {
    setEditableFields(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value
      }
    }));
  };

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
        refetch();
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      toast.error(`An error occurred while updating ${field}`);
    }
  };

  const handleStageChange = async (projectId: string, newStage: string) => {
    try {
      const dbStage = mapCustomStageToDB(newStage);
      
      const { error } = await supabase
        .from('projects')
        .update({ current_stage: dbStage })
        .eq('id', projectId);
        
      if (error) {
        toast.error('Failed to update current stage', { description: error.message });
      } else {
        toast.success('Current stage updated');
        refetch();
      }
    } catch (err) {
      console.error('Error updating stage:', err);
      toast.error('An error occurred while updating the stage');
    }
  };

  const handleStatusChange = async (projectId: string, uiStatus: ProjectStatus) => {
    try {
      const dbStatus = mapStatusToDb(uiStatus);
      
      const { error } = await supabase
        .from('projects')
        .update({ status: dbStatus })
        .eq('id', projectId);
        
      if (error) {
        toast.error('Failed to update status', { description: error.message });
      } else {
        toast.success('Status updated');
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
            {office_stages.map((stage) => (
              <TableHead key={stage.id}>{stage.name}</TableHead>
            ))}
            {editMode && <TableHead className="w-24">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const uiStatus = mapDbToStatus(project.status as Database["public"]["Enums"]["project_status"]);
            const statusColor = getStatusColor(uiStatus);
            
            const matchingLocation = locations.find(loc => 
              loc.country === project.country || loc.code === project.country
            );
            
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
                    <EditableProjectField
                      type="text"
                      className="w-20"
                      value={editableFields[project.id]?.code || project.code}
                      onChange={(value) => handleFieldChange(project.id, 'code', value)}
                      onBlur={() => handleFieldUpdate(project.id, 'code', editableFields[project.id]?.code)}
                    />
                  ) : (
                    project.code
                  )}
                </TableCell>
                
                <TableCell>
                  {editMode ? (
                    <EditableProjectField
                      type="text"
                      className="w-full"
                      value={editableFields[project.id]?.name || project.name}
                      onChange={(value) => handleFieldChange(project.id, 'name', value)}
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
                    <EditableProjectField
                      type="select"
                      className="w-40"
                      value={uiStatus}
                      onChange={(value) => handleStatusChange(project.id, value as ProjectStatus)}
                      options={[
                        { value: 'In Progress', label: 'In Progress' },
                        { value: 'Not Started', label: 'Not Started' },
                        { value: 'Completed', label: 'Completed' },
                        { value: 'On Hold', label: 'On Hold' }
                      ]}
                      onBlur={() => {}}
                    />
                  ) : (
                    <span 
                      className="inline-block px-2 py-0.5 rounded text-xs"
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
                    <EditableProjectField
                      type="select"
                      className="w-32"
                      value={project.country}
                      onChange={(value) => handleFieldUpdate(project.id, 'country', value)}
                      options={locations.map(location => ({
                        value: location.country,
                        label: location.code?.toUpperCase() || '',
                        color: location.color
                      }))}
                      onBlur={() => {}}
                    />
                  ) : (
                    <span
                      className="inline-block px-2 py-1 rounded"
                      style={{
                        background: matchingLocation?.color || "#E5DEFF",
                        color: "#212172"
                      }}
                    >
                      {matchingLocation?.code?.toUpperCase() || project.country}
                    </span>
                  )}
                </TableCell>
                
                <TableCell>
                  {editMode ? (
                    <EditableProjectField
                      type="text"
                      className="w-20"
                      value={String(editableFields[project.id]?.profit || project.target_profit_percentage || 0)}
                      onChange={(value) => handleFieldChange(project.id, 'profit', parseFloat(value))}
                      onBlur={() => handleFieldUpdate(project.id, 'profit', editableFields[project.id]?.profit)}
                    />
                  ) : (
                    project.target_profit_percentage != null ? `${project.target_profit_percentage}%` : "--"
                  )}
                </TableCell>
                
                <TableCell>
                  {editMode ? (
                    <EditableProjectField
                      type="select"
                      className="w-40"
                      value={project.current_stage}
                      onChange={(value) => handleStageChange(project.id, value)}
                      options={office_stages.map(stage => ({
                        value: stage.name,
                        label: stage.name,
                        color: stage.color
                      }))}
                      onBlur={() => {}}
                    />
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
