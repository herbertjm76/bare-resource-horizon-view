import React from "react";
import type { FormState } from "../hooks/types/projectTypes";
import { StageTeamCompositionEditor } from "../team-composition";
import { useOfficeStages } from "@/hooks/useOfficeStages";

interface ProjectResourcesTabProps {
  form: FormState;
  projectId?: string;
  roles: Array<{ id: string; name: string; code: string }>;
}

export const ProjectResourcesTab: React.FC<ProjectResourcesTabProps> = ({
  form,
  projectId,
  roles
}) => {
  const { data: officeStages = [] } = useOfficeStages();

  // Filter office stages to only those selected in form
  const stages = officeStages
    .filter(os => form.stages.includes(os.name))
    .map(os => ({
      id: os.id,
      name: os.name,
      code: os.code || undefined
    }));

  if (form.stages.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">Please select project stages in the Info tab first.</p>
      </div>
    );
  }

  // If we don't have a projectId yet (new project), show a message
  if (!projectId) {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">
          Save the project first to configure team composition per stage.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Team Composition by Stage</h3>
        <p className="text-sm text-muted-foreground">
          Plan team members and roles for each project stage. Set contracted weeks to calculate weekly demand.
        </p>
      </div>
      
      <StageTeamCompositionEditor
        projectId={projectId}
        stages={stages}
        showBudget={false}
      />
    </div>
  );
};
