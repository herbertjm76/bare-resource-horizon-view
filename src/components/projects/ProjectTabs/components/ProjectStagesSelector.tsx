
import React from 'react';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';

interface ProjectStagesSelectorProps {
  stages: string[];
  officeStages: Array<{ id: string; name: string; color?: string; code?: string }>;
  onChange: (stages: string[]) => void;
}

export const ProjectStagesSelector: React.FC<ProjectStagesSelectorProps> = ({
  stages,
  officeStages,
  onChange,
}) => {
  console.log('ProjectStagesSelector - current stages:', stages);
  console.log('ProjectStagesSelector - available office stages:', officeStages);

  // Helper function to check if stage is selected
  const isStageSelected = (stageId: string) => {
    const selected = stages.includes(stageId);
    console.log(`Stage ${stageId} selected:`, selected);
    return selected;
  };

  return (
    <div className="space-y-4">
      <Label>Project Stages</Label>
      <div className="grid grid-cols-2 gap-3">
        {officeStages.map((stage) => {
          const isSelected = isStageSelected(stage.id);
          const stageColor = stage.color || '#E5DEFF';
          
          console.log(`Stage ${stage.name} (${stage.id}): selected=${isSelected}`);
          
          return (
            <Toggle
              key={stage.id}
              pressed={isSelected}
              onPressedChange={(pressed) => {
                console.log(`Toggle ${stage.name} to ${pressed ? 'selected' : 'unselected'}`);
                const newStages = pressed
                  ? [...stages, stage.id]
                  : stages.filter(s => s !== stage.id);
                onChange(newStages);
              }}
              className={`w-full justify-start ${
                isSelected 
                  ? 'text-white hover:opacity-90' 
                  : 'hover:bg-muted'
              }`}
              style={{
                backgroundColor: isSelected ? stageColor : 'transparent',
                borderColor: stageColor,
                borderWidth: '1px'
              }}
            >
              {stage.code ? `${stage.name} (${stage.code})` : stage.name}
            </Toggle>
          );
        })}
      </div>
      
      {officeStages.length === 0 && (
        <p className="text-sm text-muted-foreground mt-2">
          No stages defined. Please add stages in office settings.
        </p>
      )}
    </div>
  );
};
