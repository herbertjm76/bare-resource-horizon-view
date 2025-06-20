
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit } from "lucide-react";
import { Role } from './types';

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newRoleName: string;
  setNewRoleName: (name: string) => void;
  onSubmit: () => void;
  editingRole: Role | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const AddRoleDialog: React.FC<AddRoleDialogProps> = ({
  open,
  onOpenChange,
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

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingRole ? 'Edit Role' : 'Add New Role'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter role name..."
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={onSubmit} 
              disabled={isSubmitting || !newRoleName.trim()}
            >
              {editingRole ? (
                <Edit className="h-4 w-4 mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {editingRole ? 'Update' : 'Add'} Role
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
