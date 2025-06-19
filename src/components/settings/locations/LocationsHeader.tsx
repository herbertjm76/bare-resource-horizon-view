
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";

interface LocationsHeaderProps {
  editMode: boolean;
  showForm: boolean;
  onToggleEditMode: () => void;
  onAddLocation: () => void;
}

export const LocationsHeader: React.FC<LocationsHeaderProps> = ({
  editMode,
  showForm,
  onToggleEditMode,
  onAddLocation
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle>Office Locations</CardTitle>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant={editMode ? "secondary" : "outline"}
          onClick={onToggleEditMode}
          disabled={showForm}
        >
          <Edit className="h-4 w-4 mr-2" />
          {editMode ? "Done" : "Edit"}
        </Button>
        <Button 
          size="sm" 
          onClick={onAddLocation}
          disabled={showForm}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>
    </CardHeader>
  );
};
