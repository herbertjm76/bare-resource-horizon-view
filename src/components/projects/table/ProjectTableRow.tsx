
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { EditableProjectField } from '../components/EditableProjectField';
import { useProjectTableRow } from './hooks/useProjectTableRow';
import type { ProjectStatus } from '../utils/projectMappings';

interface ProjectTableRowProps {
  project: any;
  editMode: boolean;
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
  selected: boolean;
  onSelect: (projectId: string) => void;
  stageColorMap: Record<string, string>;
  office_stages: Array<{ id: string; name: string; color?: string }>;
  refetch: () => void;
}

export const ProjectTableRow: React.FC<ProjectTableRowProps> = ({
  project,
  editMode,
  onDelete,
  selected,
  onSelect,
  stageColorMap,
  office_stages,
  refetch
}) => {
  const {
    handleFieldUpdate,
    handleStatusChange,
    handleStageChange,
    getStatusColor,
    locations,
    editableFields,
    getAreaByCountry
  } = useProjectTableRow(project, refetch);

  const projectArea = getAreaByCountry(project.country);

  return (
    <TableRow 
      className="align-middle text-xs hover:bg-muted/20"
      data-state={selected ? "selected" : undefined}
    >
      {editMode && (
        <TableCell>
          <input
            type="checkbox"
            className="h-3 w-3 rounded accent-[#6E59A5]"
            checked={selected}
            onChange={() => onSelect(project.id)}
          />
        </TableCell>
      )}
      
      <TableCell className="font-semibold">
        {editMode ? (
          <EditableProjectField
            type="text"
            className="w-20"
            value={editableFields[project.id]?.code || project.code}
            onChange={(value) => handleFieldUpdate(project.id, 'code', value)}
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
            onChange={(value) => handleFieldUpdate(project.id, 'name', value)}
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
            value={project.status as ProjectStatus}
            onChange={(value) => handleStatusChange(project.id, value as ProjectStatus)}
            options={[
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Not Started', label: 'Not Started' },
              { value: 'Completed', label: 'Completed' },
              { value: 'On Hold', label: 'On Hold' }
            ]}
          />
        ) : (
          <span 
            className="inline-block px-2 py-0.5 rounded text-xs"
            style={{
              background: getStatusColor(project.status).bg,
              color: getStatusColor(project.status).text
            }}
          >
            {project.status}
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
          />
        ) : (
          <span
            className="inline-block px-2 py-1 rounded"
            style={{
              background: projectArea?.color || "#E5DEFF",
              color: "#212172"
            }}
          >
            {projectArea?.code?.toUpperCase() || project.country}
          </span>
        )}
      </TableCell>
      
      <TableCell>
        {editMode ? (
          <EditableProjectField
            type="text"
            className="w-20"
            value={String(editableFields[project.id]?.profit || project.target_profit_percentage || 0)}
            onChange={(value) => handleFieldUpdate(project.id, 'profit', parseFloat(value))}
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
            value={editableFields[project.id]?.current_stage || project.current_stage || 'None'}
            onChange={(value) => handleStageChange(project.id, value)}
            options={[
              { value: 'None', label: 'None' },
              ...office_stages.map(stage => ({
                value: stage.name,
                label: stage.name,
                color: stage.color
              }))
            ]}
          />
        ) : (
          <span
            className="inline-block px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: stageColorMap[project.current_stage] || "#E5DEFF",
              color: "#212172"
            }}
          >
            {project.current_stage || 'None'}
          </span>
        )}
      </TableCell>
      
      {office_stages.map((stage) => {
        const isCurrentStage = project.current_stage === stage.name;
        return (
          <TableCell 
            key={`${project.id}-${stage.id}`} 
            className="text-center"
          >
            {isCurrentStage ? (
              <div 
                className="h-3 w-3 rounded-full mx-auto"
                style={{
                  backgroundColor: "#212172"
                }}
              />
            ) : null}
          </TableCell>
        );
      })}
      
      {editMode && (
        <TableCell>
          <Button
            onClick={() => onDelete?.(project.id)}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};
