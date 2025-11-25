
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { PracticeArea } from "@/context/officeSettings/types";
import { IconPicker } from "../departments/IconPicker";

interface AddPracticeAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPracticeAreaName: string;
  setNewPracticeAreaName: (name: string) => void;
  newPracticeAreaIcon: string;
  setNewPracticeAreaIcon: (icon: string) => void;
  onSubmit: () => void;
  editingPracticeArea: PracticeArea | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const AddPracticeAreaDialog: React.FC<AddPracticeAreaDialogProps> = ({
  open,
  onOpenChange,
  newPracticeAreaName,
  setNewPracticeAreaName,
  newPracticeAreaIcon,
  setNewPracticeAreaIcon,
  onSubmit,
  editingPracticeArea,
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
            {editingPracticeArea ? 'Edit Practice Area' : 'Add New Practice Area'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Practice Area Name</Label>
            <Input
              placeholder="e.g. Healthcare, Finance, Enterprise..."
              value={newPracticeAreaName}
              onChange={(e) => setNewPracticeAreaName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </div>
          <IconPicker 
            selectedIcon={newPracticeAreaIcon}
            onIconChange={setNewPracticeAreaIcon}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={onSubmit} 
              disabled={isSubmitting || !newPracticeAreaName.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingPracticeArea ? 'Update' : 'Add'} Practice Area
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};