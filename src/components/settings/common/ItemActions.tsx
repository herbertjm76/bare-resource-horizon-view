
import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ItemActionsProps {
  onEdit: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

export const ItemActions = ({ onEdit, onDelete, showDelete = true }: ItemActionsProps) => {
  return (
    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      {showDelete && onDelete && (
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  );
};
