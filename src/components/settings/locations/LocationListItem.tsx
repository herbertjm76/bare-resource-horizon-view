
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2 } from "lucide-react";

interface Location {
  id: string;
  code: string;
  city: string;
  country: string;
  emoji?: string;
}

interface LocationListItemProps {
  location: Location;
  editMode: boolean;
  isSelected: boolean;
  onSelect: (locationId: string) => void;
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void;
}

export const LocationListItem: React.FC<LocationListItemProps> = ({
  location,
  editMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}) => {
  return (
    <div
      className={`group flex items-center justify-between p-4 border rounded-lg transition-all duration-200 ${
        editMode ? 'hover:bg-accent/30' : 'hover:border-brand-accent/20 hover:bg-brand-accent/5'
      }`}
    >
      <div className="flex items-center gap-3">
        {editMode && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(location.id)}
          />
        )}
        <div className="flex items-center gap-2">
          {location.emoji && <span className="text-lg">{location.emoji}</span>}
          <div>
            <div className="font-medium">{location.code}</div>
            <div className="text-sm text-muted-foreground">
              {location.city}, {location.country}
            </div>
          </div>
        </div>
      </div>
      {!editMode && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(location)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(location.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )}
    </div>
  );
};
