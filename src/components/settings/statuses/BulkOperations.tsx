import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BulkOperationsProps {
  selectedStatuses: string[];
  onBulkDelete: () => void;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedStatuses,
  onBulkDelete,
}) => {
  if (selectedStatuses.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <span className="text-sm font-medium">
        {selectedStatuses.length} status(es) selected
      </span>
      <Button
        size="sm"
        variant="destructive"
        onClick={onBulkDelete}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Selected
      </Button>
    </div>
  );
};
