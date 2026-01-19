
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
    <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border/50">
      <Button 
        type="button" 
        variant="ghost" 
        onClick={onClose}
        className="px-6"
      >
        Cancel
      </Button>
      <Button 
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="px-6 min-w-[140px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
};
