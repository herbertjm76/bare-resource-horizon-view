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
import type { ProjectStatus } from '@/context/officeSettings/types';

interface AddStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newStatusName: string;
  setNewStatusName: (name: string) => void;
  newStatusColor: string;
  setNewStatusColor: (color: string) => void;
  onSubmit: () => void;
  editingStatus: ProjectStatus | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const AddStatusDialog: React.FC<AddStatusDialogProps> = ({
  open,
  onOpenChange,
  newStatusName,
  setNewStatusName,
  newStatusColor,
  setNewStatusColor,
  onSubmit,
  editingStatus,
  isSubmitting,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingStatus ? 'Edit Status' : 'Add New Status'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="statusName">Status Name</Label>
            <Input
              id="statusName"
              value={newStatusName}
              onChange={(e) => setNewStatusName(e.target.value)}
              placeholder="Enter status name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="statusColor">Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="statusColor"
                type="color"
                value={newStatusColor}
                onChange={(e) => setNewStatusColor(e.target.value)}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={newStatusColor}
                onChange={(e) => setNewStatusColor(e.target.value)}
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
          <Button onClick={onSubmit} disabled={isSubmitting || !newStatusName.trim()}>
            {isSubmitting ? 'Saving...' : editingStatus ? 'Update' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
