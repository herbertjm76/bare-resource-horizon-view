import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building2 } from 'lucide-react';
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
      className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 bg-card border border-border hover:border-primary/30"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm text-foreground line-clamp-2">
            {project.name}
          </h4>
          <Badge variant="outline" className="text-xs shrink-0">
            {project.code}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Building2 className="h-3 w-3" />
          <span>{project.current_stage}</span>
        </div>
        
        {project.department && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{project.department}</span>
          </div>
        )}
        
        {project.contract_end_date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(project.contract_end_date), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
