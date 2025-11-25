import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BulkOperationsProps {
  selectedProjectTypes: string[];
  onBulkDelete: () => void;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedProjectTypes,
  onBulkDelete
}) => {
  if (selectedProjectTypes.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted">
      <span className="text-sm font-medium">
        {selectedProjectTypes.length} selected
      </span>
      <Button
        variant="destructive"
        size="sm"
        onClick={onBulkDelete}
        className="ml-auto"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Selected
      </Button>
    </div>
  );
};
