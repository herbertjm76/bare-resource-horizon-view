
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";

interface CountriesToolbarProps {
  editMode: boolean;
  setEditMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  setOpen: (v: boolean) => void;
  disabled?: boolean;
}

const CountriesToolbar: React.FC<CountriesToolbarProps> = ({
  editMode,
  setEditMode,
  setOpen,
  disabled = false,
}) => (
  <div className="flex gap-2">
    <Button 
      size="sm" 
      variant={editMode ? "secondary" : "outline"} 
      onClick={() => setEditMode(em => !em)}
      disabled={disabled}
    >
      <Edit className="h-4 w-4 mr-2" /> {editMode ? "Done" : "Edit"}
    </Button>
    <Button 
      size="sm" 
      onClick={() => setOpen(true)}
      disabled={disabled}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Area
    </Button>
  </div>
);

export default CountriesToolbar;
