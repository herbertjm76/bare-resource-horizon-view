
import React, { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface NewProjectStep3StagesProps {
  stages: string[];
  setStages: (stages: string[]) => void;
  officeStages: { id: string; name: string; color?: string }[];
}

const colors = [
  "#4f46e5", "#0ea5e9", "#10b981", "#f97316", "#ec4899", 
  "#8b5cf6", "#d946ef", "#6366f1", "#0891b2", "#0d9488"
];

// Store stage colors locally, since they aren't in the database yet
const stageColorMap: Record<string, string> = {};

const NewProjectStep3Stages: React.FC<NewProjectStep3StagesProps> = ({ 
  stages, 
  setStages,
  officeStages
}) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  
  const handleAddStage = (stageId: string) => {
    if (!stages.includes(stageId)) {
      const newStages = [...stages, stageId];
      setStages(newStages);
      
      // Assign the selected color to this stage
      if (!stageColorMap[stageId]) {
        stageColorMap[stageId] = selectedColor;
        // Cycle to next color for convenience
        const nextColorIndex = (colors.indexOf(selectedColor) + 1) % colors.length;
        setSelectedColor(colors[nextColorIndex]);
      }
    }
  };
  
  const handleRemoveStage = (stageId: string) => {
    setStages(stages.filter(id => id !== stageId));
  };

  const getStageName = (stageId: string) => {
    const stage = officeStages.find(s => s.id === stageId);
    return stage ? stage.name : 'Unknown Stage';
  };

  const getStageColor = (stageId: string) => {
    return stageColorMap[stageId] || colors[0];
  };

  const updateStageColor = (stageId: string, color: string) => {
    stageColorMap[stageId] = color;
    // Force a re-render
    setStages([...stages]);
  };

  const availableStages = officeStages.filter(stage => !stages.includes(stage.id));

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Project Stages</label>
        <p className="text-sm text-muted-foreground mb-2">
          Select the stages for this project. At least one stage is required.
        </p>
      </div>
      
      {stages.length > 0 ? (
        <div className="space-y-2">
          {stages.map((stageId) => (
            <div key={stageId} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <div 
                      className="w-5 h-5 rounded-full cursor-pointer" 
                      style={{ backgroundColor: getStageColor(stageId) }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    <div className="grid grid-cols-5 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2`}
                          style={{ backgroundColor: color }}
                          onClick={() => updateStageColor(stageId, color)}
                        >
                          {getStageColor(stageId) === color && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <span>{getStageName(stageId)}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveStage(stageId)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
          No stages added yet. Add stages from below.
        </div>
      )}
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Available Stages</h4>
        {availableStages.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {availableStages.map((stage) => (
              <Button
                key={stage.id}
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => handleAddStage(stage.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {stage.name}
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            All available stages have been added.
          </div>
        )}
      </div>
      
      {/* Color selector for the next stage to be added */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Next Stage Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedColor === color ? 'ring-2 ring-[#6E59A5]' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewProjectStep3Stages;
