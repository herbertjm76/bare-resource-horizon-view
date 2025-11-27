
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2 } from "lucide-react";

interface ResourceDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (globalDelete: boolean) => void;
  resourceName: string;
  hasOtherAllocations: boolean;
  projectCount: number;
  totalHours: number;
  isLoading?: boolean;
}

export const ResourceDeleteDialog: React.FC<ResourceDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  resourceName,
  hasOtherAllocations,
  projectCount,
  totalHours,
  isLoading = false
}) => {
  const [deleteOption, setDeleteOption] = useState<'project' | 'global'>('project');

  // Reset to project-only deletion when dialog opens
  useEffect(() => {
    if (isOpen) {
      setDeleteOption('project');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const globalDelete = deleteOption === 'global';
    onConfirm(globalDelete);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Remove Resource
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You are about to remove <strong>{resourceName}</strong> from this project.
          </p>
          
          {totalHours > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-amber-800 font-medium">
                    This resource has {totalHours} hours logged in this project
                  </p>
                  <p className="text-amber-700 mt-1">
                    Removing this resource will also delete all logged hours.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {hasOtherAllocations && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-800 font-medium">
                    This resource has allocations in {projectCount} other project{projectCount > 1 ? 's' : ''}
                  </p>
                  <p className="text-yellow-700 mt-1">
                    Choose how you want to handle the removal:
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <RadioGroup value={deleteOption} onValueChange={(value) => setDeleteOption(value as 'project' | 'global')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="project" id="project" />
              <Label htmlFor="project" className="text-sm">
                Remove from this project only
              </Label>
            </div>
            
            {hasOtherAllocations && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="global" id="global" />
                <Label htmlFor="global" className="text-sm">
                  Remove from all projects and clear all allocations
                </Label>
              </div>
            )}
          </RadioGroup>
          
          {deleteOption === 'global' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Warning: This action cannot be undone</p>
                  <p className="mt-1">
                    This will remove {resourceName} from all projects and delete all their allocation data across the entire system.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Removing...' : 'Remove Resource'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
