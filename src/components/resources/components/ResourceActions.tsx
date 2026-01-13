
import React, { useState } from 'react';
import { Trash2, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ResourceDeleteDialog } from '../dialogs/ResourceDeleteDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ResourceActionsProps {
  resourceId: string;
  resourceName: string;
  resourceType: 'active' | 'pre_registered';
  totalAllocatedHours: number;
  onDeleteResource: (resourceId: string, globalDelete?: boolean) => void;
  onCheckOtherProjects?: (resourceId: string, resourceType: 'active' | 'pre_registered') => Promise<{ hasOtherAllocations: boolean; projectCount: number; }>;
  onHideResource?: (resourceId: string) => void;
}

export const ResourceActions: React.FC<ResourceActionsProps> = ({
  resourceId,
  resourceName,
  resourceType,
  totalAllocatedHours,
  onDeleteResource,
  onCheckOtherProjects,
  onHideResource
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDialogData, setDeleteDialogData] = useState({
    hasOtherAllocations: false,
    projectCount: 0,
    totalHours: 0,
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
          totalHours: totalAllocatedHours,
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
      // Show dialog with hours info even without other project check
      setDeleteDialogData({
        hasOtherAllocations: false,
        projectCount: 0,
        totalHours: totalAllocatedHours,
        isLoading: false
      });
      setShowDeleteDialog(true);
    }
  };

  const handleDeleteConfirm = (globalDelete: boolean) => {
    onDeleteResource(resourceId, globalDelete);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="flex items-center gap-0.5">
        {onHideResource && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100 text-muted-foreground hover:text-foreground"
                  onClick={() => onHideResource(resourceId)}
                >
                  <EyeOff className="h-3 w-3" />
                  <span className="sr-only">Hide row</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hide row (keeps data)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete (removes data)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ResourceDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        resourceName={resourceName}
        hasOtherAllocations={deleteDialogData.hasOtherAllocations}
        projectCount={deleteDialogData.projectCount}
        totalHours={deleteDialogData.totalHours}
        isLoading={deleteDialogData.isLoading}
      />
    </>
  );
};
