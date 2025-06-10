
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { ProjectFinancialTab } from "../../ProjectTabs/ProjectFinancialTab";

interface ProjectFinancialTabContentProps {
  form: any;
  onChange: (key: string, value: any) => void;
  financialMetrics?: {
    total_budget: number;
    total_spent: number;
    total_revenue: number;
    profit_margin: number;
    budget_variance: number;
    schedule_variance: number;
  };
}

export const ProjectFinancialTabContent: React.FC<ProjectFinancialTabContentProps> = ({
  form,
  onChange,
  financialMetrics
}) => {
  return (
    <TabsContent value="financial" className="mt-0">
      <ProjectFinancialTab 
        form={form}
        onChange={onChange}
        financialMetrics={financialMetrics}
      />
    </TabsContent>
  );
};
