
import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { EditableProjectField } from '../components/EditableProjectField';
import { useProjectTableRow } from './hooks/useProjectTableRow';
import { EditProjectDialog } from '../EditProjectDialog';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOfficeSettings } from '@/context/OfficeSettingsContext';

type ColumnKey = 'code' | 'name' | 'pm' | 'status' | 'country' | 'department' | 'stage';

interface ProjectTableRowProps {
  project: any;
  editMode: boolean;
  onDelete?: (projectId: string) => void;
  selected: boolean;
  onSelect: (projectId: string) => void;
  stageColorMap: Record<string, string>;
  office_stages: Array<{ id: string; name: string; color?: string }>;
  getProjectStageFee: (projectId: string, officeStageId: string) => number | null;
  refetch: () => void;
  saveSignal?: number;
  expandedColumn: ColumnKey | null;
  onColumnClick: (column: ColumnKey) => void;
}

export const ProjectTableRow: React.FC<ProjectTableRowProps> = ({
  project,
  editMode,
  onDelete,
  selected,
  onSelect,
  stageColorMap,
  office_stages,
  getProjectStageFee,
  refetch,
  saveSignal,
  expandedColumn,
  onColumnClick
}) => {
  const handleColumnClick = (column: ColumnKey) => {
    onColumnClick(expandedColumn === column ? null : column);
  };
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { project_statuses } = useOfficeSettings();

  const {
    handleFieldUpdate,
    getStatusColor,
    locations,
    editableFields,
    getAreaByCountry,
    departments,
    updateEditableField,
    flushPendingUpdates,
    managers,
    projectAreas
  } = useProjectTableRow(project, refetch);

  const projectArea = getAreaByCountry(project.country);

  // Get the current stage name from office stages
  const getCurrentStageName = () => {
    if (!project.current_stage) return 'None';
    const stage = office_stages.find(s => s.id === project.current_stage);
    return stage ? stage.name : project.current_stage;
  };

  // Get the current stage color
  const getCurrentStageColor = () => {
    if (!project.current_stage) return '#E5DEFF';
    const stage = office_stages.find(s => s.id === project.current_stage);
    return stage?.color || stageColorMap[project.current_stage] || '#E5DEFF';
  };

  useEffect(() => {
    if (saveSignal !== undefined) {
      flushPendingUpdates(project.id);
    }
  }, [saveSignal]);

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
              className="h-3 w-3 rounded accent-brand-accent"
              checked={selected}
              onChange={() => onSelect(project.id)}
            />
          </TableCell>
        )}
        
        <TableCell 
          className="font-semibold p-0 cursor-pointer hover:bg-muted/10 transition-colors"
          onClick={() => handleColumnClick('code')}
        >
          {editMode ? (
            <Input
              value={editableFields[project.id]?.code || project.code}
              onChange={(e) => updateEditableField(project.id, 'code', e.target.value)}
              className="w-full h-full border-0 rounded-none bg-transparent focus-visible:ring-1 focus-visible:ring-primary text-xs font-semibold px-4 py-3"
            />
          ) : (
            <div className="px-4 py-3">{project.code}</div>
          )}
        </TableCell>
        
        <TableCell 
          className="p-0 cursor-pointer hover:bg-muted/10 transition-colors"
          onClick={() => handleColumnClick('name')}
        >
          {editMode ? (
            <Input
              value={editableFields[project.id]?.name || project.name}
              onChange={(e) => updateEditableField(project.id, 'name', e.target.value)}
              className="w-full h-full border-0 rounded-none bg-transparent focus-visible:ring-1 focus-visible:ring-primary text-xs px-4 py-3"
            />
          ) : (
            <div className="px-4 py-3">
              <span className="font-bold">{project.name}</span>
            </div>
          )}
        </TableCell>
        
        <TableCell 
          className="p-0 cursor-pointer hover:bg-muted/10 transition-colors"
          onClick={() => handleColumnClick('pm')}
        >
          {editMode ? (
            <Select 
              value={editableFields[project.id]?.project_manager_id || project.project_manager_id || 'not_assigned'} 
              onValueChange={(value) => updateEditableField(project.id, 'project_manager_id', value === 'not_assigned' ? null : value)}
            >
              <SelectTrigger className="w-full h-full border-0 rounded-none bg-transparent focus-visible:ring-1 focus-visible:ring-primary text-xs px-4 py-3">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="not_assigned">Not Assigned</SelectItem>
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="px-4 py-3">{project.project_manager?.first_name || '-'}</div>
          )}
        </TableCell>
        
        <TableCell 
          className="p-0 cursor-pointer hover:bg-muted/10 transition-colors"
          onClick={() => handleColumnClick('status')}
        >
          {editMode ? (
            <Select 
              value={editableFields[project.id]?.status || project.status} 
              onValueChange={(value) => updateEditableField(project.id, 'status', value)}
            >
              <SelectTrigger className="w-full h-full border-0 rounded-none bg-transparent focus-visible:ring-1 focus-visible:ring-primary text-xs px-4 py-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {project_statuses.map((status) => (
                  <SelectItem key={status.id} value={status.name}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="px-4 py-3">
              <span 
                className="inline-block px-2 py-0.5 rounded text-xs"
                style={{
                  background: getStatusColor(project.status).bg,
                  color: getStatusColor(project.status).text
                }}
              >
                {project.status}
              </span>
            </div>
          )}
        </TableCell>
        
        <TableCell 
          className="p-0 cursor-pointer hover:bg-muted/10 transition-colors"
          onClick={() => handleColumnClick('country')}
        >
          {editMode ? (
            <Select 
              value={editableFields[project.id]?.country || project.country || ''} 
              onValueChange={(value) => updateEditableField(project.id, 'country', value)}
            >
              <SelectTrigger className="w-full h-full border-0 rounded-none bg-transparent focus-visible:ring-1 focus-visible:ring-primary text-xs px-4 py-3">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {projectAreas.map((area) => (
                  <SelectItem key={area.id} value={area.name}>
                    <span
                      className="inline-block px-2 py-0.5 rounded"
                      style={{
                        background: area.color || "#E5DEFF",
                        color: "#212172"
                      }}
                    >
                      {area.code?.toUpperCase() || area.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="px-4 py-3">
              <span
                className="inline-block px-2 py-1 rounded"
                style={{
                  background: projectArea?.color || "#E5DEFF",
                  color: "#212172"
                }}
              >
                {projectArea?.code?.toUpperCase() || project.country}
              </span>
            </div>
          )}
        </TableCell>
        
        <TableCell 
          className="p-0 cursor-pointer hover:bg-muted/10 transition-colors"
          onClick={() => handleColumnClick('department')}
        >
          {editMode ? (
            <Select 
              value={editableFields[project.id]?.department || project.department || ''} 
              onValueChange={(value) => updateEditableField(project.id, 'department', value)}
            >
              <SelectTrigger className="w-full h-full border-0 rounded-none bg-transparent focus-visible:ring-1 focus-visible:ring-primary text-xs px-4 py-3">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="px-4 py-3">
              <span className="text-xs">{project.department || '-'}</span>
            </div>
          )}
        </TableCell>
        
        {/* <TableCell>
          {project.target_profit_percentage != null ? `${project.target_profit_percentage}%` : "--"}
        </TableCell> */}
        
        <TableCell 
          className="p-0 cursor-pointer hover:bg-muted/10 transition-colors"
          onClick={() => handleColumnClick('stage')}
        >
          {editMode ? (
            <Select 
              value={editableFields[project.id]?.current_stage || project.current_stage || ''} 
              onValueChange={(value) => updateEditableField(project.id, 'current_stage', value)}
            >
              <SelectTrigger className="w-full h-full border-0 rounded-none bg-transparent focus-visible:ring-1 focus-visible:ring-primary text-xs px-4 py-3">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {office_stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="px-4 py-3">
              <span
                className="inline-block px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: getCurrentStageColor(),
                  color: "#212172"
                }}
              >
                {getCurrentStageName()}
              </span>
            </div>
          )}
        </TableCell>
        
        {/* Stage fees columns hidden for MVP */}
        {/* {office_stages.map((stage) => {
          const fee = getProjectStageFee(project.id, stage.id);
          return (
            <TableCell 
              key={`${project.id}-${stage.id}`} 
              className="text-center"
            >
              {fee !== null ? (
                <span className="text-xs">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(fee)}
                </span>
              ) : (
                "-"
              )}
            </TableCell>
          );
        })} */}
        
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
