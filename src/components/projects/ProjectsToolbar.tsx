
import React from "react";
import { Button } from "@/components/ui/button";
import { NewProjectDialog } from "./NewProjectDialog";
import { Edit, Trash2 } from "lucide-react";

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
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={editMode ? "secondary" : "outline"}
        size="sm"
        className="mr-2"
        onClick={() => setEditMode(!editMode)}
      >
        <Edit className="h-4 w-4 mr-1" />
        {editMode ? "Done" : "Edit"}
      </Button>
      {editMode && selectedCount > 0 && (
        <Button 
          variant="destructive"
          size="sm"
          className="mr-2"
          onClick={onBulkDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete ({selectedCount})
        </Button>
      )}
      <NewProjectDialog onProjectCreated={onProjectCreated} />
    </div>
  );
};

export default ProjectsToolbar;
