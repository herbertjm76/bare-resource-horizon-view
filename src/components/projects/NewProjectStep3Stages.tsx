
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare } from "lucide-react";

type OfficeStageOption = { id: string; name: string };

interface Props {
  stages: string[];
  setStages: (value: string[]) => void;
  officeStages: OfficeStageOption[];
}

const NewProjectStep3Stages: React.FC<Props> = ({ stages, setStages, officeStages }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-[#6E59A5]">Project Stages</h3>
    <div>
      <div className="font-semibold mb-3 flex items-center gap-2 text-sm">
        <CheckSquare className="w-4 h-4" />Select Project Stages<span className="text-destructive">*</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-1">
        {officeStages.map(stage => (
          <label className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted/50 transition-colors" key={stage.id}>
            <Checkbox
              checked={stages.includes(stage.id)}
              onCheckedChange={checked => {
                setStages(
                  checked
                    ? [...stages, stage.id]
                    : stages.filter(s => s !== stage.id)
                );
              }}
            />
            <span className="text-base">{stage.name}</span>
          </label>
        ))}
      </div>
      {officeStages.length === 0 && (
        <p className="text-sm text-muted-foreground italic">No project stages available</p>
      )}
    </div>
  </div>
);

export default NewProjectStep3Stages;
