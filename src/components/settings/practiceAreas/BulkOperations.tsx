
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BulkOperationsProps {
  selectedPracticeAreas: string[];
  onBulkDelete: () => void;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedPracticeAreas,
  onBulkDelete
}) => {
  if (selectedPracticeAreas.length === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
      <span className="text-sm text-muted-foreground">
        {selectedPracticeAreas.length} practice area(s) selected
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