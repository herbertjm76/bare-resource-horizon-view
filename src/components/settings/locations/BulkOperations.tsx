
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BulkOperationsProps {
  selectedCount: number;
  onBulkDelete: () => void;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedCount,
  onBulkDelete
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
      <span className="text-sm text-muted-foreground">
        {selectedCount} location(s) selected
      </span>
      <Button 
        size="sm" 
        variant="destructive"
        onClick={onBulkDelete}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete Selected
      </Button>
    </div>
  );
};
