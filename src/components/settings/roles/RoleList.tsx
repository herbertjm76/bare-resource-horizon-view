import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, Trash2, Users } from "lucide-react";
import { Role } from './types';
import { cn } from '@/lib/utils';

interface RoleListProps {
  roles: Role[];
  editMode: boolean;
  selectedRoles: string[];
  onSelectRole: (roleId: string) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onInlineUpdate?: (role: Role, newName: string) => Promise<void>;
}

export const RoleList: React.FC<RoleListProps> = ({
  roles,
  editMode,
  selectedRoles,
  onSelectRole,
  onEdit,
  onDelete,
  onInlineUpdate
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startEditing = (role: Role) => {
    setEditingId(role.id);
    setEditValue(role.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEditing = async (role: Role) => {
    if (!editValue.trim() || editValue.trim() === role.name) {
      cancelEditing();
      return;
    }
    
    if (onInlineUpdate) {
      setIsSaving(true);
      try {
        await onInlineUpdate(role, editValue.trim());
        setEditingId(null);
        setEditValue('');
      } finally {
        setIsSaving(false);
      }
    } else {
      // Fallback to old behavior
      onEdit({ ...role, name: editValue.trim() });
      cancelEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, role: Role) => {
    if (e.key === 'Enter') {
      saveEditing(role);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {roles.map((role) => {
        const isSelected = selectedRoles.includes(role.id);
        const isEditing = editingId === role.id;
        
        return (
          <div
            key={role.id}
            className={cn(
              "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 border",
              "hover:bg-muted/50",
              isSelected && "bg-primary/5 hover:bg-primary/10 border-primary/30"
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
            
            {/* Role name - editable or static */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, role)}
                    onBlur={() => saveEditing(role)}
                    className="h-8 text-sm"
                    disabled={isSaving}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 shrink-0"
                    onClick={() => saveEditing(role)}
                    disabled={isSaving}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
                    onClick={cancelEditing}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <span 
                  className={cn(
                    "font-medium text-foreground truncate block cursor-pointer",
                    "hover:text-primary transition-colors"
                  )}
                  onClick={() => startEditing(role)}
                  title="Click to edit"
                >
                  {role.name}
                </span>
              )}
            </div>
            
            {/* Delete action - only visible when not editing */}
            {!isEditing && (
              <div className={cn(
                "flex items-center gap-1 transition-opacity",
                editMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(role)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
