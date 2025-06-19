
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Department } from "@/context/officeSettings/types";

interface DepartmentFormProps {
  newDepartmentName: string;
  setNewDepartmentName: (name: string) => void;
  onSubmit: () => void;
  editingDepartment: Department | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  newDepartmentName,
  setNewDepartmentName,
  onSubmit,
  editingDepartment,
  isSubmitting,
  onCancel
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter department name..."
        value={newDepartmentName}
        onChange={(e) => setNewDepartmentName(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button 
        onClick={onSubmit} 
        disabled={isSubmitting || !newDepartmentName.trim()}
      >
        <Plus className="h-4 w-4 mr-2" />
        {editingDepartment ? 'Update' : 'Add'} Department
      </Button>
      {editingDepartment && (
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
};
