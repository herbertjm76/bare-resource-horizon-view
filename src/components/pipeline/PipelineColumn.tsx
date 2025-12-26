import React from 'react';
import { PipelineCard } from './PipelineCard';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  code: string;
  current_stage: string;
  status: string;
  contract_end_date?: string | null;
  department?: string | null;
  project_manager_id?: string | null;
  stages?: string[] | null;
}

interface PipelineColumnProps {
  title: string;
  status: string;
  projects: Project[];
  color: string;
  onDragStart: (e: React.DragEvent, projectId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
  onCardClick?: (project: Project) => void;
  isDragOver: boolean;
  draggingProjectId?: string | null;
}

export const PipelineColumn: React.FC<PipelineColumnProps> = ({
  title,
  status,
  projects,
  color,
  onDragStart,
  onDragOver,
  onDrop,
  onCardClick,
  isDragOver,
  draggingProjectId,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col min-w-[180px] w-[180px] bg-muted/30 rounded-lg border-2 border-border transition-all duration-300 ease-out",
        isDragOver && "border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20"
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      {/* Column Header */}
      <div className="p-2 border-b border-border">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <div 
              className="w-2 h-2 rounded-full shrink-0" 
              style={{ backgroundColor: color }}
            />
            <h3 className="font-medium text-xs text-foreground truncate">{title}</h3>
          </div>
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full shrink-0">
            {projects.length}
          </span>
        </div>
      </div>
      
      {/* Cards Container */}
      <div className="flex-1 p-1.5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)]">
        {projects.length === 0 ? (
          <div className={cn(
            "flex items-center justify-center h-12 text-[10px] text-muted-foreground border-2 border-dashed rounded transition-all duration-300",
            isDragOver ? "border-primary bg-primary/5" : "border-border"
          )}>
            {isDragOver ? "Drop here" : "Empty"}
          </div>
        ) : (
          projects.map((project) => (
            <PipelineCard
              key={project.id}
              project={project}
              onDragStart={onDragStart}
              onClick={onCardClick}
              isDragging={draggingProjectId === project.id}
            />
          ))
        )}
      </div>
    </div>
  );
};
