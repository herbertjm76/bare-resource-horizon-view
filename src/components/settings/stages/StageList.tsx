import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, Trash2, Layers } from "lucide-react";
import { ProjectStage } from "@/context/officeSettings/types";
import { cn } from '@/lib/utils';

interface StageListProps {
  stages: ProjectStage[];
  editMode: boolean;
  selectedStages: string[];
  onSelectStage: (stageId: string) => void;
  onEdit: (stage: ProjectStage) => void;
  onDelete: (stage: ProjectStage) => void;
  onInlineUpdate?: (stage: ProjectStage, updates: { name: string; code: string; color: string }) => Promise<void>;
}

export const StageList: React.FC<StageListProps> = ({
  stages,
  editMode,
  selectedStages,
  onSelectStage,
  onEdit,
  onDelete,
  onInlineUpdate
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editColor, setEditColor] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startEditing = (stage: ProjectStage) => {
    setEditingId(stage.id);
    setEditName(stage.name);
    setEditCode(stage.code || '');
    setEditColor(stage.color || '#E5DEFF');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditCode('');
    setEditColor('');
  };

  const saveEditing = async (stage: ProjectStage) => {
    if (!editName.trim()) {
      cancelEditing();
      return;
    }
    
    const hasChanges = 
      editName.trim() !== stage.name || 
      editCode.trim() !== (stage.code || '') || 
      editColor !== (stage.color || '#E5DEFF');
    
    if (!hasChanges) {
      cancelEditing();
      return;
    }
    
    if (onInlineUpdate) {
      setIsSaving(true);
      try {
        await onInlineUpdate(stage, { 
          name: editName.trim(), 
          code: editCode.trim(),
          color: editColor 
        });
        setEditingId(null);
        setEditName('');
        setEditCode('');
        setEditColor('');
      } finally {
        setIsSaving(false);
      }
    } else {
      onEdit({ ...stage, name: editName.trim(), code: editCode.trim(), color: editColor });
      cancelEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, stage: ProjectStage) => {
    if (e.key === 'Enter') {
      saveEditing(stage);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  if (stages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Layers className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No stages defined</h3>
        <p className="text-sm text-muted-foreground">
          Add your first stage to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {stages.map((stage, index) => {
        const isSelected = selectedStages.includes(stage.id);
        const isEditing = editingId === stage.id;
        
        return (
          <div
            key={stage.id}
            className={cn(
              "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150",
              "hover:bg-muted/50",
              isSelected && "bg-primary/5 hover:bg-primary/10",
              index !== stages.length - 1 && "border-b border-border/50"
            )}
          >
            {/* Checkbox for edit mode */}
            {editMode && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelectStage(stage.id)}
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
                className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
                style={{ backgroundColor: stage.color || '#E5DEFF' }}
              >
                <Layers className="h-4 w-4 text-foreground/70" />
              </div>
            )}
            
            {/* Stage name and code - editable or static */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, stage)}
                    placeholder="Name"
                    className="h-8 text-sm flex-1"
                    disabled={isSaving}
                  />
                  <Input
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, stage)}
                    onBlur={() => saveEditing(stage)}
                    placeholder="Code"
                    className="h-8 text-sm w-20"
                    disabled={isSaving}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 shrink-0"
                    onClick={() => saveEditing(stage)}
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
                <div 
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    "hover:text-primary transition-colors"
                  )}
                  onClick={() => startEditing(stage)}
                  title="Click to edit"
                >
                  <span className="font-medium text-foreground truncate">
                    {stage.name}
                  </span>
                  {stage.code && (
                    <span className="text-xs text-muted-foreground">
                      ({stage.code})
                    </span>
                  )}
                </div>
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
                  onClick={() => onDelete(stage)}
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
