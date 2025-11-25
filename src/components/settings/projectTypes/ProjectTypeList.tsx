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
    <div className="space-y-2">
      {projectTypes.map((projectType) => (
        <div
          key={projectType.id}
          className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          {editMode && (
            <Checkbox
              checked={selectedProjectTypes.includes(projectType.id)}
              onCheckedChange={() => onSelectProjectType(projectType.id)}
            />
          )}
          
          <div className="flex items-center gap-2 flex-1">
            {projectType.icon && getIcon(projectType.icon)}
            <span className="font-medium">{projectType.name}</span>
          </div>

          {editMode && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(projectType)}
              >
                <Edit className="h-4 w-4" />
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
