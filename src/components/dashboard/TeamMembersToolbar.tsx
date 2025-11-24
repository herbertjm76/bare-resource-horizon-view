
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus, Upload } from "lucide-react";
import { ExcelImportDialog } from "@/components/projects/ExcelImportDialog";

interface TeamMembersToolbarProps {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  selectedCount: number;
  onBulkDelete?: () => void;
  onAdd?: () => void;
  onImportComplete?: () => void;
}

const TeamMembersToolbar: React.FC<TeamMembersToolbarProps> = ({ 
  editMode,
  setEditMode,
  selectedCount,
  onBulkDelete,
  onAdd,
  onImportComplete
}) => {
  return (
    <div className="flex items-center gap-2">
      {onAdd && (
        <Button 
          variant="default"
          size="sm"
          onClick={onAdd}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Add Member
        </Button>
      )}
      <ExcelImportDialog 
        onImportComplete={onImportComplete}
        trigger={
          <Button 
            variant="outline" 
            size="sm"
          >
            <Upload className="h-4 w-4 mr-1" />
            Import Excel
          </Button>
        }
      />
      <Button 
        variant={editMode ? "secondary" : "outline"}
        size="sm"
        onClick={() => setEditMode(!editMode)}
      >
        <Edit className="h-4 w-4 mr-1" />
        {editMode ? "Done" : "Edit"}
      </Button>
      {editMode && selectedCount > 0 && (
        <Button 
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete ({selectedCount})
        </Button>
      )}
    </div>
  );
};

export default TeamMembersToolbar;
