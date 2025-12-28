import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Users, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName, getProjectSecondaryText } from '@/utils/projectDisplay';

interface Project {
  id: string;
  name: string;
  code: string;
  current_stage: string;
  contract_end_date?: string | null;
  department?: string | null;
  project_manager_id?: string | null;
  stages?: string[] | null;
}

interface PipelineCardProps {
  project: Project;
  onDragStart: (e: React.DragEvent, projectId: string) => void;
  onClick?: (project: Project) => void;
  isDragging?: boolean;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({ project, onDragStart, onClick, isDragging }) => {
  const { projectDisplayPreference } = useAppSettings();
  
  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger click when dragging
    if (e.defaultPrevented) return;
    onClick?.(project);
  };

  const hasStages = project.stages && project.stages.length > 0;

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, project.id)}
      onClick={handleClick}
      className={`p-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 bg-card border border-border hover:border-primary/30 group ${
        isDragging ? 'opacity-50 scale-95 shadow-lg ring-2 ring-primary/50 rotate-1' : ''
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-1">
          <p className="font-medium text-[11px] text-foreground line-clamp-2 leading-tight flex-1">
            {getProjectDisplayName(project, projectDisplayPreference)}
          </p>
          <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
        <p className="text-[10px] text-muted-foreground font-mono">
          {getProjectSecondaryText(project, projectDisplayPreference)}
        </p>
        <div className="flex items-center gap-2">
          {project.contract_end_date && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="h-2.5 w-2.5" />
              <span>{format(new Date(project.contract_end_date), 'MMM d')}</span>
            </div>
          )}
          {hasStages && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground" title="Has team composition">
              <Users className="h-2.5 w-2.5" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
