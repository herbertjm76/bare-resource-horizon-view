import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import type { ProjectStatus } from '@/context/officeSettings/types';

interface StatusListProps {
  statuses: ProjectStatus[];
  editMode: boolean;
  selectedStatuses: string[];
  onSelectStatus: (id: string) => void;
  onEdit: (status: ProjectStatus) => void;
  onDelete: (status: ProjectStatus) => void;
}

export const StatusList: React.FC<StatusListProps> = ({
  statuses,
  editMode,
  selectedStatuses,
  onSelectStatus,
  onEdit,
  onDelete,
}) => {
  if (statuses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No statuses defined yet. Add your first status to get started.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {statuses.map((status) => (
        <div
          key={status.id}
          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {editMode && (
              <Checkbox
                checked={selectedStatuses.includes(status.id)}
                onCheckedChange={() => onSelectStatus(status.id)}
              />
            )}
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: status.color || '#6366f1' }}
            />
            <span className="font-medium">{status.name}</span>
          </div>
          {!editMode && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(status)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(status)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
