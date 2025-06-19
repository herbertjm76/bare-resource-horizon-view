
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { ColorPicker } from "../ColorPicker";
import { ProjectStage } from "@/context/officeSettings/types";

interface StageFormProps {
  newStageName: string;
  setNewStageName: (name: string) => void;
  newStageColor: string;
  setNewStageColor: (color: string) => void;
  onSubmit: () => void;
  editingStage: ProjectStage | null;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const StageForm: React.FC<StageFormProps> = ({
  newStageName,
  setNewStageName,
  newStageColor,
  setNewStageColor,
  onSubmit,
  editingStage,
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
        placeholder="Enter stage name..."
        value={newStageName}
        onChange={(e) => setNewStageName(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <ColorPicker
        selectedColor={newStageColor}
        onColorChange={setNewStageColor}
      />
      <Button 
        onClick={onSubmit} 
        disabled={isSubmitting || !newStageName.trim()}
      >
        <Plus className="h-4 w-4 mr-2" />
        {editingStage ? 'Update' : 'Add'} Stage
      </Button>
      {editingStage && (
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
};
