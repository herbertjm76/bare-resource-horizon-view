
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus } from "lucide-react";

interface TeamMembersToolbarProps {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  selectedCount: number;
  onBulkDelete?: () => void;
  onAdd?: () => void;
}

const TeamMembersToolbar: React.FC<TeamMembersToolbarProps> = ({ 
  editMode,
  setEditMode,
  selectedCount,
  onBulkDelete,
  onAdd
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {onAdd && (
        <Button 
          variant="default"
          size="sm"
          onClick={onAdd}
          className="w-full sm:w-auto"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Add Member</span>
          <span className="sm:hidden">Add</span>
        </Button>
      )}
      <Button 
        variant={editMode ? "secondary" : "outline"}
        size="sm"
        onClick={() => setEditMode(!editMode)}
        className="w-full sm:w-auto"
      >
        <Edit className="h-4 w-4 mr-1" />
        {editMode ? "Done" : "Edit"}
      </Button>
      {editMode && selectedCount > 0 && (
        <Button 
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          className="w-full sm:w-auto"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete ({selectedCount})
        </Button>
      )}
    </div>
  );
};

export default TeamMembersToolbar;
