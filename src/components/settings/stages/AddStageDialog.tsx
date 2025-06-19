
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { ProjectStage } from "@/context/officeSettings/types";
import { ColorPicker, colorPalette } from '../ColorPicker';

interface AddStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newStageName: string;
  setNewStageName: (name: string) => void;
  newStageColor: string;
  setNewStageColor: (color: string) => void;
  onSubmit: () => void;
  editingStage: ProjectStage | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const AddStageDialog: React.FC<AddStageDialogProps> = ({
  open,
  onOpenChange,
  newStageName,
  setNewStageName,
  newStageColor,
  setNewStageColor,
  onSubmit,
  editingStage,
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
            {editingStage ? 'Edit Stage' : 'Add New Stage'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter stage name..."
            value={newStageName}
            onChange={(e) => setNewStageName(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <ColorPicker
              selectedColor={newStageColor || colorPalette[0]}
              onColorChange={setNewStageColor}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={onSubmit} 
              disabled={isSubmitting || !newStageName.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingStage ? 'Update' : 'Add'} Stage
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
