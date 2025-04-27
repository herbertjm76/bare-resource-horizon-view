
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";

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
    <div className="flex items-center gap-2">
      <Button 
        variant="default"
        size="sm"
        className="mr-2"
        onClick={onAdd}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Member
      </Button>
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
    </div>
  );
};

export default TeamMembersToolbar;
