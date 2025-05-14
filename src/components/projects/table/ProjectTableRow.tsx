
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { EditableProjectField } from '../components/EditableProjectField';
import { useProjectTableRow } from './hooks/useProjectTableRow';
import type { ProjectStatus } from '../utils/projectMappings';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EditProjectDialog } from '../EditProjectDialog';

interface ProjectTableRowProps {
  project: any;
  editMode: boolean;
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
  const [isEditing, setIsEditing] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

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
    <>
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
        
        <TableCell className="font-semibold">{project.code}</TableCell>
        <TableCell><span className="font-bold">{project.name}</span></TableCell>
        <TableCell>{project.project_manager?.first_name || '-'}</TableCell>
        
        <TableCell>
          <span 
            className="inline-block px-2 py-0.5 rounded text-xs"
            style={{
              background: getStatusColor(project.status).bg,
              color: getStatusColor(project.status).text
            }}
          >
            {project.status}
          </span>
        </TableCell>
        
        <TableCell>
          <span
            className="inline-block px-2 py-1 rounded"
            style={{
              background: projectArea?.color || "#E5DEFF",
              color: "#212172"
            }}
          >
            {projectArea?.code?.toUpperCase() || project.country}
          </span>
        </TableCell>
        
        <TableCell>
          {project.target_profit_percentage != null ? `${project.target_profit_percentage}%` : "--"}
        </TableCell>
        
        <TableCell>
          <span
            className="inline-block px-2 py-1 rounded text-xs"
            style={{
              backgroundColor: stageColorMap[project.current_stage] || "#E5DEFF",
              color: "#212172"
            }}
          >
            {project.current_stage || 'None'}
          </span>
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
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowEditDialog(true)}
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

      {/* Add the EditProjectDialog component */}
      {showEditDialog && (
        <EditProjectDialog
          project={project}
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          refetch={refetch}
        />
      )}
    </>
  );
};
