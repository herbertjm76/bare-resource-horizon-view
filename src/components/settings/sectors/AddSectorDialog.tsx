
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Sector } from "@/context/officeSettings/types";
import { IconPicker } from "../departments/IconPicker";

interface AddSectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newSectorName: string;
  setNewSectorName: (name: string) => void;
  newSectorIcon: string;
  setNewSectorIcon: (icon: string) => void;
  onSubmit: () => void;
  editingSector: Sector | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const AddSectorDialog: React.FC<AddSectorDialogProps> = ({
  open,
  onOpenChange,
  newSectorName,
  setNewSectorName,
  newSectorIcon,
  setNewSectorIcon,
  onSubmit,
  editingSector,
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
            {editingSector ? 'Edit Sector' : 'Add New Sector'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Sector Name</Label>
            <Input
              placeholder="Enter sector name..."
              value={newSectorName}
              onChange={(e) => setNewSectorName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </div>
          <IconPicker 
            selectedIcon={newSectorIcon}
            onIconChange={setNewSectorIcon}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={onSubmit} 
              disabled={isSubmitting || !newSectorName.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingSector ? 'Update' : 'Add'} Sector
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
