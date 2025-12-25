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
}

interface PipelineColumnProps {
  title: string;
  status: string;
  projects: Project[];
  color: string;
  onDragStart: (e: React.DragEvent, projectId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
  isDragOver: boolean;
}

export const PipelineColumn: React.FC<PipelineColumnProps> = ({
  title,
  status,
  projects,
  color,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col min-w-[280px] max-w-[320px] bg-muted/30 rounded-lg border border-border transition-colors",
        isDragOver && "border-primary bg-primary/5"
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {projects.length}
          </span>
        </div>
      </div>
      
      {/* Cards Container */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
        {projects.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-xs text-muted-foreground border border-dashed border-border rounded-lg">
            No projects
          </div>
        ) : (
          projects.map((project) => (
            <PipelineCard
              key={project.id}
              project={project}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};
