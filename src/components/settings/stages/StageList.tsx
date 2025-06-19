
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ProjectStage } from "@/context/officeSettings/types";

interface StageListProps {
  stages: ProjectStage[];
  editMode: boolean;
  selectedStages: string[];
  onSelectStage: (stageId: string) => void;
  onEdit: (stage: ProjectStage) => void;
  onDelete: (stage: ProjectStage) => void;
}

export const StageList: React.FC<StageListProps> = ({
  stages,
  editMode,
  selectedStages,
  onSelectStage,
  onEdit,
  onDelete
}) => {
  if (stages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No stages defined yet. Add your first stage above.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {stages.map((stage) => (
        <Card key={stage.id} className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {editMode && (
                <input
                  type="checkbox"
                  checked={selectedStages.includes(stage.id)}
                  onChange={() => onSelectStage(stage.id)}
                  className="rounded"
                />
              )}
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stage.color || "#E5DEFF" }}
              />
              <span className="font-medium text-sm">{stage.name}</span>
            </div>
            {editMode && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(stage)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(stage)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
