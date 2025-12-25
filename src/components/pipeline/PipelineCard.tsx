import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Project {
  id: string;
  name: string;
  code: string;
  current_stage: string;
  contract_end_date?: string | null;
  department?: string | null;
  project_manager_id?: string | null;
}

interface PipelineCardProps {
  project: Project;
  onDragStart: (e: React.DragEvent, projectId: string) => void;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({ project, onDragStart }) => {
  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, project.id)}
      className="p-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 bg-card border border-border hover:border-primary/30"
    >
      <div className="space-y-1">
        <p className="font-medium text-[11px] text-foreground line-clamp-2 leading-tight">
          {project.name}
        </p>
        <p className="text-[10px] text-muted-foreground font-mono">
          {project.code}
        </p>
        {project.contract_end_date && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-2.5 w-2.5" />
            <span>{format(new Date(project.contract_end_date), 'MMM d')}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
