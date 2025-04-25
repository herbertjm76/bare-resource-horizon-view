
import React from "react";
import { Button } from "@/components/ui/button";

interface ProjectDialogActionsProps {
  isLoading: boolean;
  onClose: () => void;
}

export const ProjectDialogActions: React.FC<ProjectDialogActionsProps> = ({
  isLoading,
  onClose,
}) => {
  return (
    <div className="flex justify-end gap-4 p-6 border-t sticky bottom-0 bg-background">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};
