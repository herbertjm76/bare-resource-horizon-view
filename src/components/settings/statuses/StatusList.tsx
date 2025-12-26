import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, Trash2, Circle } from "lucide-react";
import type { ProjectStatus } from '@/context/officeSettings/types';
import { cn } from '@/lib/utils';

interface StatusListProps {
  statuses: ProjectStatus[];
  editMode: boolean;
  selectedStatuses: string[];
  onSelectStatus: (id: string) => void;
  onEdit: (status: ProjectStatus) => void;
  onDelete: (status: ProjectStatus) => void;
  onInlineUpdate?: (status: ProjectStatus, updates: { name: string; color: string }) => Promise<void>;
}

export const StatusList: React.FC<StatusListProps> = ({
  statuses,
  editMode,
  selectedStatuses,
  onSelectStatus,
  onEdit,
  onDelete,
  onInlineUpdate
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startEditing = (status: ProjectStatus) => {
    setEditingId(status.id);
    setEditName(status.name);
    setEditColor(status.color || '#6366f1');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditColor('');
  };

  const saveEditing = async (status: ProjectStatus) => {
    if (!editName.trim()) {
      cancelEditing();
      return;
    }
    
    const hasChanges = editName.trim() !== status.name || editColor !== (status.color || '#6366f1');
    if (!hasChanges) {
      cancelEditing();
      return;
    }
    
    if (onInlineUpdate) {
      setIsSaving(true);
      try {
        await onInlineUpdate(status, { name: editName.trim(), color: editColor });
        setEditingId(null);
        setEditName('');
        setEditColor('');
      } finally {
        setIsSaving(false);
      }
    } else {
      onEdit({ ...status, name: editName.trim(), color: editColor });
      cancelEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, status: ProjectStatus) => {
    if (e.key === 'Enter') {
      saveEditing(status);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  if (statuses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Circle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No statuses defined</h3>
        <p className="text-sm text-muted-foreground">
          Add your first status to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {statuses.map((status, index) => {
        const isSelected = selectedStatuses.includes(status.id);
        const isEditing = editingId === status.id;
        
        return (
          <div
            key={status.id}
            className={cn(
              "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150",
              "hover:bg-muted/50",
              isSelected && "bg-primary/5 hover:bg-primary/10",
              index !== statuses.length - 1 && "border-b border-border/50"
            )}
          >
            {/* Checkbox for edit mode */}
            {editMode && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelectStatus(status.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            )}
            
            {/* Color indicator */}
            {isEditing ? (
              <input
                type="color"
                value={editColor}
                onChange={(e) => setEditColor(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0"
                disabled={isSaving}
              />
            ) : (
              <div
                className="w-9 h-9 rounded-lg shrink-0"
                style={{ backgroundColor: status.color || '#6366f1' }}
              />
            )}
            
            {/* Status name - editable or static */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, status)}
                    onBlur={() => saveEditing(status)}
                    className="h-8 text-sm"
                    disabled={isSaving}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 shrink-0"
                    onClick={() => saveEditing(status)}
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
                  onClick={() => startEditing(status)}
                  title="Click to edit"
                >
                  {status.name}
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
                  onClick={() => onDelete(status)}
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
