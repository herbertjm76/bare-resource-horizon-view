
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Role } from './types';

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
      <div className="text-center py-8 text-muted-foreground">
        No roles defined yet. Add your first role above.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {roles.map((role) => (
        <Card key={role.id} className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {editMode && (
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => onSelectRole(role.id)}
                  className="rounded"
                />
              )}
              <span className="font-medium text-sm">{role.name}</span>
            </div>
            {editMode && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(role)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(role)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
