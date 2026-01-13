
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus, Check, X, Mail } from "lucide-react";
import { useBulkInvites } from "@/hooks/useBulkInvites";

interface TeamMembersToolbarProps {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  selectedCount: number;
  selectedMemberIds?: string[];
  selectedPendingCount?: number;
  onBulkDelete?: () => void;
  onAdd?: () => void;
  onSaveAll?: () => void;
  onCancelEdit?: () => void;
  hasChanges?: boolean;
  isSaving?: boolean;
}

const TeamMembersToolbar: React.FC<TeamMembersToolbarProps> = ({ 
  editMode,
  setEditMode,
  selectedCount,
  selectedMemberIds = [],
  selectedPendingCount = 0,
  onBulkDelete,
  onAdd,
  onSaveAll,
  onCancelEdit,
  hasChanges,
  isSaving
}) => {
  const { sendBulkInvites, isSending } = useBulkInvites();

  const handleSendInvites = async () => {
    await sendBulkInvites(selectedMemberIds);
  };

  return (
    <div className="flex items-center gap-2">
      {!editMode && onAdd && (
        <Button 
          variant="default"
          size="sm"
          onClick={onAdd}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Add Member
        </Button>
      )}
      {!editMode ? (
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setEditMode(true)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      ) : (
        <>
          <Button 
            variant="default"
            size="sm"
            onClick={onSaveAll}
            disabled={isSaving}
          >
            <Check className="h-4 w-4 mr-1" />
            {isSaving ? "Saving..." : "Done"}
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={onCancelEdit}
            disabled={isSaving}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </>
      )}
      {editMode && selectedCount > 0 && (
        <>
          {/* Only show Send Invites if there are pending members selected */}
          {selectedPendingCount > 0 && (
            <Button 
              variant="outline"
              size="sm"
              onClick={handleSendInvites}
              disabled={isSaving || isSending}
            >
              <Mail className="h-4 w-4 mr-1" />
              {isSending ? "Sending..." : `Send Invites (${selectedPendingCount})`}
            </Button>
          )}
          <Button 
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            disabled={isSaving}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete ({selectedCount})
          </Button>
        </>
      )}
    </div>
  );
};

export default TeamMembersToolbar;
