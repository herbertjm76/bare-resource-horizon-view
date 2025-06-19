
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Department } from "@/context/officeSettings/types";

interface AddDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newDepartmentName: string;
  setNewDepartmentName: (name: string) => void;
  onSubmit: () => void;
  editingDepartment: Department | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const AddDepartmentDialog: React.FC<AddDepartmentDialogProps> = ({
  open,
  onOpenChange,
  newDepartmentName,
  setNewDepartmentName,
  onSubmit,
  editingDepartment,
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
            {editingDepartment ? 'Edit Department' : 'Add New Department'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter department name..."
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={onSubmit} 
              disabled={isSubmitting || !newDepartmentName.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingDepartment ? 'Update' : 'Add'} Department
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
