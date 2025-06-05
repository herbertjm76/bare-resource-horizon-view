
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface ProjectDialogActionsProps {
  isLoading: boolean;
  onClose: () => void;
}

export const ProjectDialogActions: React.FC<ProjectDialogActionsProps> = ({
  isLoading,
  onClose,
}) => {
  return (
    <DialogFooter className="px-6 py-4 border-t mt-6">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </DialogFooter>
  );
};
