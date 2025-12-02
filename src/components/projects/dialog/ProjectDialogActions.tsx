
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface ProjectDialogActionsProps {
  isLoading: boolean;
  onClose: () => void;
  onSubmit?: () => Promise<boolean> | boolean;
  submitLabel?: string;
}

export const ProjectDialogActions: React.FC<ProjectDialogActionsProps> = ({
  isLoading,
  onClose,
  onSubmit,
  submitLabel = "Save Changes"
}) => {
  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit();
    }
  };

  return (
    <DialogFooter className="px-6 py-4 border-t mt-6">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        type="button" 
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? "Saving..." : submitLabel}
      </Button>
    </DialogFooter>
  );
};
