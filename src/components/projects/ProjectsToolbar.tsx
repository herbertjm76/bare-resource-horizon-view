
import React from "react";
import { Button } from "@/components/ui/button";
import { NewProjectDialog } from "./NewProjectDialog";
import { ExcelImportDialog } from "./ExcelImportDialog";
import { Edit, Trash2, Upload, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectsToolbarProps {
  onProjectCreated?: () => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  selectedCount: number;
  onBulkDelete?: () => void;
}

const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({ 
  onProjectCreated,
  editMode,
  setEditMode,
  selectedCount,
  onBulkDelete
}) => {
  const isMobile = useIsMobile();
  
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
              size={isMobile ? "icon" : "sm"}
              className="mr-2"
              onClick={() => setEditMode(!editMode)}
            >
              <Edit className="h-4 w-4" />
              {!isMobile && <span className="ml-1">{editMode ? "Done" : "Edit"}</span>}
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
                size={isMobile ? "icon" : "sm"}
                className="mr-2"
                onClick={onBulkDelete}
              >
                <Trash2 className="h-4 w-4" />
                {!isMobile && <span className="ml-1">Delete ({selectedCount})</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete {selectedCount} selected project{selectedCount > 1 ? 's' : ''}</p>
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
                    size={isMobile ? "icon" : "sm"}
                  >
                    <Upload className="h-4 w-4" />
                    {!isMobile && <span className="ml-1">Import Excel</span>}
                  </Button>
                }
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Import Excel file</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <NewProjectDialog 
                onProjectCreated={onProjectCreated} 
                trigger={
                  <Button 
                    variant="default" 
                    size={isMobile ? "icon" : "sm"}
                  >
                    <Plus className="h-4 w-4" />
                    {!isMobile && <span className="ml-1">New Project</span>}
                  </Button>
                }
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create new project</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ProjectsToolbar;
