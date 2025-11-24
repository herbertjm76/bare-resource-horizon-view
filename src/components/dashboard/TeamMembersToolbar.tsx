
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus, Upload, Check, X, Image } from "lucide-react";
import { ExcelImportDialog } from "@/components/projects/ExcelImportDialog";
import { ImportFromScreenshotDialog } from "../team/ImportFromScreenshotDialog";

interface TeamMembersToolbarProps {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  selectedCount: number;
  onBulkDelete?: () => void;
  onAdd?: () => void;
  onImportComplete?: () => void;
  onSaveAll?: () => void;
  onCancelEdit?: () => void;
  hasChanges?: boolean;
  isSaving?: boolean;
}

const TeamMembersToolbar: React.FC<TeamMembersToolbarProps> = ({ 
  editMode,
  setEditMode,
  selectedCount,
  onBulkDelete,
  onAdd,
  onImportComplete,
  onSaveAll,
  onCancelEdit,
  hasChanges,
  isSaving
}) => {
  const [showScreenshotDialog, setShowScreenshotDialog] = useState(false);
  
  return (
    <>
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
      {!editMode && (
        <>
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
            variant="outline" 
            size="sm"
            onClick={() => setShowScreenshotDialog(true)}
          >
            <Image className="h-4 w-4 mr-1" />
            Import Screenshot
          </Button>
        </>
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
        <Button 
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          disabled={isSaving}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete ({selectedCount})
        </Button>
      )}
    </div>
    
    <ImportFromScreenshotDialog
      isOpen={showScreenshotDialog}
      onClose={() => setShowScreenshotDialog(false)}
      onImportComplete={() => {
        setShowScreenshotDialog(false);
        onImportComplete?.();
      }}
    />
  </>
  );
};

export default TeamMembersToolbar;
