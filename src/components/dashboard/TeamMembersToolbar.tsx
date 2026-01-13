
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus, Check, X, Mail, Link, Copy } from "lucide-react";
import { useBulkInvites } from "@/hooks/useBulkInvites";
import { useCompany } from "@/context/CompanyContext";
import { toast } from "sonner";

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
  const { company } = useCompany();

  const handleSendInvites = async () => {
    await sendBulkInvites(selectedMemberIds);
  };

  const handleCopyGenericLink = () => {
    if (company?.subdomain) {
      // Use production domain instead of preview URL
      const productionBaseUrl = 'https://app.bareresource.com';
      const genericLink = `${productionBaseUrl}/${company.subdomain}/join`;
      navigator.clipboard.writeText(genericLink);
      toast.success("Generic invite link copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!editMode && (
        <Button 
          variant="outline"
          size="sm"
          onClick={handleCopyGenericLink}
          title="Copy generic invite link for Teams/Slack"
        >
          <Link className="h-4 w-4 mr-1" />
          Copy Invite Link
        </Button>
      )}
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
