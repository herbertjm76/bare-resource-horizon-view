
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { ProjectFinancialTab } from "../../ProjectTabs/ProjectFinancialTab";
import type { FinancialMetrics } from "../../hooks/useProjectFinancialMetrics";

interface ProjectFinancialTabContentProps {
  form: any;
  onChange: (key: string, value: any) => void;
  financialMetrics?: FinancialMetrics;
  officeStages?: Array<{ id: string; name: string; color?: string }>;
}

export const ProjectFinancialTabContent: React.FC<ProjectFinancialTabContentProps> = ({
  form,
  onChange,
  financialMetrics,
  officeStages
}) => {
  return (
    <TabsContent value="financial" className="mt-0">
      <ProjectFinancialTab 
        form={form}
        onChange={onChange}
        financialMetrics={financialMetrics}
        officeStages={officeStages}
      />
    </TabsContent>
  );
};
