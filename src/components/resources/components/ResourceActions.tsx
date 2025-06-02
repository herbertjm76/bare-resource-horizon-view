
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ResourceDeleteDialog } from '../dialogs/ResourceDeleteDialog';

interface ResourceActionsProps {
  resourceId: string;
  resourceName: string;
  resourceType: 'active' | 'pre_registered';
  onDeleteResource: (resourceId: string, globalDelete?: boolean) => void;
  onCheckOtherProjects?: (resourceId: string, resourceType: 'active' | 'pre_registered') => Promise<{ hasOtherAllocations: boolean; projectCount: number; }>;
}

export const ResourceActions: React.FC<ResourceActionsProps> = ({
  resourceId,
  resourceName,
  resourceType,
  onDeleteResource,
  onCheckOtherProjects
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDialogData, setDeleteDialogData] = useState({
    hasOtherAllocations: false,
    projectCount: 0,
    isLoading: false
  });

  const handleDeleteClick = async () => {
    if (onCheckOtherProjects) {
      setDeleteDialogData(prev => ({ ...prev, isLoading: true }));
      
      try {
        const result = await onCheckOtherProjects(resourceId, resourceType);
        setDeleteDialogData({
          hasOtherAllocations: result.hasOtherAllocations,
          projectCount: result.projectCount,
          isLoading: false
        });
        setShowDeleteDialog(true);
      } catch (error) {
        console.error('Error checking other projects:', error);
        setDeleteDialogData(prev => ({ ...prev, isLoading: false }));
        // Fallback to simple deletion
        onDeleteResource(resourceId, false);
      }
    } else {
      // Fallback if check function not provided
      onDeleteResource(resourceId, false);
    }
  };

  const handleDeleteConfirm = (globalDelete: boolean) => {
    onDeleteResource(resourceId, globalDelete);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100 text-muted-foreground hover:text-destructive"
        onClick={handleDeleteClick}
        disabled={deleteDialogData.isLoading}
      >
        <Trash2 className="h-3 w-3" />
        <span className="sr-only">Delete resource</span>
      </Button>

      <ResourceDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        resourceName={resourceName}
        hasOtherAllocations={deleteDialogData.hasOtherAllocations}
        projectCount={deleteDialogData.projectCount}
        isLoading={deleteDialogData.isLoading}
      />
    </>
  );
};
