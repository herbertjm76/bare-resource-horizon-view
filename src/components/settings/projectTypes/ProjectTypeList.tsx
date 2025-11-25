import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { ProjectType } from '@/context/officeSettings/types';
import * as Icons from 'lucide-react';

interface ProjectTypeListProps {
  projectTypes: ProjectType[];
  editMode: boolean;
  selectedProjectTypes: string[];
  onSelectProjectType: (id: string) => void;
  onEdit: (projectType: ProjectType) => void;
  onDelete: (id: string) => void;
}

export const ProjectTypeList: React.FC<ProjectTypeListProps> = ({
  projectTypes,
  editMode,
  selectedProjectTypes,
  onSelectProjectType,
  onEdit,
  onDelete
}) => {
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  if (projectTypes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No project types yet. Add one to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {projectTypes.map((projectType) => (
        <div
          key={projectType.id}
          className="relative flex flex-col gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          style={{ borderLeftColor: projectType.color || 'transparent', borderLeftWidth: '4px' }}
        >
          {editMode && (
            <div className="absolute top-2 right-2">
              <Checkbox
                checked={selectedProjectTypes.includes(projectType.id)}
                onCheckedChange={() => onSelectProjectType(projectType.id)}
              />
            </div>
          )}
          
          <div className="flex items-center gap-3 pr-8">
            {projectType.icon && (
              <div 
                className="flex items-center justify-center w-10 h-10 rounded-md"
                style={{ backgroundColor: projectType.color || 'hsl(var(--muted))', color: 'white' }}
              >
                {getIcon(projectType.icon)}
              </div>
            )}
            <span className="font-medium flex-1">{projectType.name}</span>
          </div>

          {editMode && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(projectType)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(projectType.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
