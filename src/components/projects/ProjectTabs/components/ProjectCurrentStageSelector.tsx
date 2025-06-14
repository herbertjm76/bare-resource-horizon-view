
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProjectCurrentStageSelectorProps {
  currentStage: string;
  selectedStages: string[];
  officeStages: Array<{ id: string; name: string; color?: string }>;
  onChange: (stageId: string) => void;
}

export const ProjectCurrentStageSelector: React.FC<ProjectCurrentStageSelectorProps> = ({
  currentStage,
  selectedStages,
  officeStages,
  onChange,
}) => {
  // Filter office stages to only show those that are selected for this project
  const availableStages = officeStages.filter(stage => selectedStages.includes(stage.id));

  console.log('ProjectCurrentStageSelector - currentStage:', currentStage);
  console.log('ProjectCurrentStageSelector - selectedStages:', selectedStages);
  console.log('ProjectCurrentStageSelector - availableStages:', availableStages);

  // Handle the onChange to convert "none" back to empty string for the database
  const handleStageChange = (value: string) => {
    const actualValue = value === "none" ? "" : value;
    onChange(actualValue);
  };

  // Convert empty string to "none" for the select component
  const selectValue = currentStage || "none";

  return (
    <div className="space-y-2">
      <Label htmlFor="current-stage">Current Stage</Label>
      <Select 
        value={selectValue} 
        onValueChange={handleStageChange}
      >
        <SelectTrigger id="current-stage">
          <SelectValue placeholder="Select current stage" />
        </SelectTrigger>
        <SelectContent>
          {availableStages.length === 0 ? (
            <SelectItem value="disabled" disabled>
              No stages selected for this project
            </SelectItem>
          ) : (
            <>
              <SelectItem value="none">No current stage</SelectItem>
              {availableStages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: stage.color || '#E5DEFF' }}
                    />
                    {stage.name}
                  </div>
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
      {selectedStages.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Please select project stages first to choose a current stage.
        </p>
      )}
    </div>
  );
};
