
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface ProjectDialogActionsProps {
  isLoading: boolean;
  onClose: () => void;
  onSubmit?: () => Promise<boolean> | boolean;
}

export const ProjectDialogActions: React.FC<ProjectDialogActionsProps> = ({
  isLoading,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      const success = await onSubmit();
      if (success) {
        onClose();
      }
    }
  };

  return (
    <DialogFooter className="px-6 py-4 border-t mt-6">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </DialogFooter>
  );
};
