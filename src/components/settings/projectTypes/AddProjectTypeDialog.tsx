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
            <Label htmlFor="projectTypeIcon">Icon (optional)</Label>
            <Input
              id="projectTypeIcon"
              value={newProjectTypeIcon}
              onChange={(e) => setNewProjectTypeIcon(e.target.value)}
              placeholder="e.g., circle, star, check"
            />
            <p className="text-xs text-muted-foreground">
              Use Lucide icon names (e.g., circle, star, check, folder, briefcase)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectTypeColor">Color (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="projectTypeColor"
                type="color"
                value={newProjectTypeColor}
                onChange={(e) => setNewProjectTypeColor(e.target.value)}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                value={newProjectTypeColor}
                onChange={(e) => setNewProjectTypeColor(e.target.value)}
                placeholder="#6366f1"
                className="flex-1"
              />
            </div>
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
