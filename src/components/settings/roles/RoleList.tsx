import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2, Users } from "lucide-react";
import { Role } from './types';
import { cn } from '@/lib/utils';

interface RoleListProps {
  roles: Role[];
  editMode: boolean;
  selectedRoles: string[];
  onSelectRole: (roleId: string) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export const RoleList: React.FC<RoleListProps> = ({
  roles,
  editMode,
  selectedRoles,
  onSelectRole,
  onEdit,
  onDelete
}) => {
  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No roles defined</h3>
        <p className="text-sm text-muted-foreground">
          Add your first role to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {roles.map((role, index) => {
        const isSelected = selectedRoles.includes(role.id);
        
        return (
          <div
            key={role.id}
            className={cn(
              "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150",
              "hover:bg-muted/50",
              isSelected && "bg-primary/5 hover:bg-primary/10",
              index !== roles.length - 1 && "border-b border-border/50"
            )}
          >
            {/* Checkbox for edit mode */}
            {editMode && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelectRole(role.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            )}
            
            {/* Role icon */}
            <div className={cn(
              "flex items-center justify-center w-9 h-9 rounded-lg shrink-0",
              "bg-primary/10 text-primary"
            )}>
              <Users className="h-4 w-4" />
            </div>
            
            {/* Role name */}
            <div className="flex-1 min-w-0">
              <span className="font-medium text-foreground truncate block">
                {role.name}
              </span>
              <span className="text-xs text-muted-foreground">
                Code: {role.code}
              </span>
            </div>
            
            {/* Actions - always visible in edit mode, hover in normal mode */}
            <div className={cn(
              "flex items-center gap-1 transition-opacity",
              editMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => onEdit(role)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(role)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
