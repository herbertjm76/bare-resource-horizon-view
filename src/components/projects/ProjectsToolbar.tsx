
import React from "react";
import { Button } from "@/components/ui/button";
import { NewProjectDialog } from "./NewProjectDialog";
import { ExcelImportDialog } from "./ExcelImportDialog";
import { Edit, Trash2, Upload, Plus, ListChecks } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProjectsToolbarProps {
  onProjectCreated?: () => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  selectedCount: number;
  onBulkDelete?: () => void;
  iconOnly?: boolean;
  onManageStatuses?: () => void;
}

const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({ 
  onProjectCreated,
  editMode,
  setEditMode,
  selectedCount,
  onBulkDelete,
  iconOnly = false,
  onManageStatuses
}) => {
  const handleImportComplete = () => {
    if (onProjectCreated) {
      onProjectCreated();
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={editMode ? "secondary" : "outline"}
              size={iconOnly ? "icon" : "sm"}
              className="mr-2"
              onClick={() => setEditMode(!editMode)}
            >
              <Edit className="h-4 w-4" />
              {!iconOnly && <span className="ml-1">{editMode ? "Done" : "Edit"}</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{editMode ? "Done editing" : "Edit projects"}</p>
          </TooltipContent>
        </Tooltip>

        {editMode && selectedCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="destructive"
                size={iconOnly ? "icon" : "sm"}
                className="mr-2"
                onClick={onBulkDelete}
              >
                <Trash2 className="h-4 w-4" />
                {!iconOnly && <span className="ml-1">Delete ({selectedCount})</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete {selectedCount} selected project{selectedCount > 1 ? 's' : ''}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {editMode && onManageStatuses && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline"
                size={iconOnly ? "icon" : "sm"}
                className="mr-2"
                onClick={onManageStatuses}
              >
                <ListChecks className="h-4 w-4" />
                {!iconOnly && <span className="ml-1">Statuses</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Manage project statuses</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ExcelImportDialog 
                onImportComplete={handleImportComplete} 
                trigger={
                  <Button 
                    variant="outline" 
                    size={iconOnly ? "icon" : "sm"}
                  >
                    <Upload className="h-4 w-4" />
                    {!iconOnly && <span className="ml-1">Import Excel</span>}
                  </Button>
                }
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Import Excel file</p>
          </TooltipContent>
        </Tooltip>

      </div>
    </TooltipProvider>
  );
};

export default ProjectsToolbar;
