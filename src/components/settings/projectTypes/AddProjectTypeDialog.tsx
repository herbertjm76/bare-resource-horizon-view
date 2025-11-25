import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProjectType } from '@/context/officeSettings/types';
import { IconPicker } from './IconPicker';
import { ThemedColorPicker } from './ThemedColorPicker';

interface AddProjectTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newProjectTypeName: string;
  setNewProjectTypeName: (name: string) => void;
  newProjectTypeIcon: string;
  setNewProjectTypeIcon: (icon: string) => void;
  newProjectTypeColor: string;
  setNewProjectTypeColor: (color: string) => void;
  onSubmit: () => void;
  editingProjectType: ProjectType | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const AddProjectTypeDialog: React.FC<AddProjectTypeDialogProps> = ({
  open,
  onOpenChange,
  newProjectTypeName,
  setNewProjectTypeName,
  newProjectTypeIcon,
  setNewProjectTypeIcon,
  newProjectTypeColor,
  setNewProjectTypeColor,
  onSubmit,
  editingProjectType,
  isSubmitting,
  onCancel
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>
            {editingProjectType ? 'Edit Project Type' : 'Add New Project Type'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectTypeName">Project Type Name</Label>
            <Input
              id="projectTypeName"
              value={newProjectTypeName}
              onChange={(e) => setNewProjectTypeName(e.target.value)}
              placeholder="e.g., Active Projects, Active Pursuits"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label>Icon (optional)</Label>
            <IconPicker
              selectedIcon={newProjectTypeIcon}
              onIconChange={setNewProjectTypeIcon}
            />
          </div>
          <div className="space-y-2">
            <Label>Color (optional)</Label>
            <ThemedColorPicker
              selectedColor={newProjectTypeColor}
              onColorChange={setNewProjectTypeColor}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting || !newProjectTypeName.trim()}>
            {isSubmitting ? 'Saving...' : (editingProjectType ? 'Update' : 'Add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
