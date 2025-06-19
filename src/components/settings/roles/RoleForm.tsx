
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Role } from './types';

interface RoleFormProps {
  newRoleName: string;
  setNewRoleName: (name: string) => void;
  onSubmit: () => void;
  editingRole: Role | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  newRoleName,
  setNewRoleName,
  onSubmit,
  editingRole,
  isSubmitting,
  onCancel
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter role name..."
        value={newRoleName}
        onChange={(e) => setNewRoleName(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button 
        onClick={onSubmit} 
        disabled={isSubmitting || !newRoleName.trim()}
      >
        <Plus className="h-4 w-4 mr-2" />
        {editingRole ? 'Update' : 'Add'} Role
      </Button>
      {editingRole && (
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
};
