
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BulkOperationsProps {
  selectedDepartments: string[];
  onBulkDelete: () => void;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedDepartments,
  onBulkDelete
}) => {
  if (selectedDepartments.length === 0) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
      <span className="text-sm text-muted-foreground">
        {selectedDepartments.length} department(s) selected
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
