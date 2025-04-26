
import React, { useEffect } from "react";
import { StagesGrid } from "./components/StagesGrid";
import type { FormState } from "../hooks/types/projectTypes";

interface ProjectStageFeesTabProps {
  form: FormState;
  officeStages: Array<{ id: string; name: string; color?: string }>;
  updateStageFee: (stageId: string, data: Partial<FormState['stageFees'][string]>) => void;
}

export const ProjectStageFeesTab: React.FC<ProjectStageFeesTabProps> = ({
  form,
  officeStages,
  updateStageFee
}) => {
  console.log("ProjectStageFeesTab - form:", form);
  console.log("ProjectStageFeesTab - stages:", form.stages);
  console.log("ProjectStageFeesTab - stageFees:", form.stageFees);
  console.log("ProjectStageFeesTab - officeStages:", officeStages);

  // Log whenever stageFees changes
  useEffect(() => {
    console.log("StageFees changed:", form.stageFees);
  }, [form.stageFees]);

  const generateYearMonths = () => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    return years.flatMap(year => 
      months.map(month => ({
        value: `${month} ${year}`,
        label: `${month} ${year}`
      }))
    );
  };
  
  const calculateInvoiceAge = (invoiceDate: Date | null): string => {
    if (!invoiceDate) return 'N/A';
    const today = new Date();
    if (invoiceDate > today) return 'N/A';
    const diffTime = Math.abs(today.getTime() - invoiceDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  };
  
  const calculateHours = (fee: string): string => {
    if (!fee || !form.avgRate || parseFloat(form.avgRate) === 0) return '';
    const feeValue = parseFloat(fee);
    const rateValue = parseFloat(form.avgRate);
    if (isNaN(feeValue) || isNaN(rateValue) || rateValue === 0) return '';
    return (feeValue / rateValue).toFixed(2);
  };

  const getStageColor = (stageId: string): string => {
    const stage = officeStages.find(s => s.id === stageId);
    return stage?.color || "#E5DEFF";
  };

  // Make sure we're using the stages IDs from form.stages
  const selectedStages = officeStages.filter(stage => form.stages.includes(stage.id));
  const billingOptions = generateYearMonths();

  console.log("Selected stages for fees:", selectedStages);
  console.log("Are there any stage fees?", Object.keys(form.stageFees).length > 0);

  if (form.stages.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">Please select project stages in the Info tab first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Fee Structure</h3>
        <p className="text-sm text-muted-foreground">
          Define fees and billing information for each project stage
        </p>
      </div>
      
      <StagesGrid
        selectedStages={selectedStages}
        stageFees={form.stageFees}
        billingOptions={billingOptions}
        updateStageFee={updateStageFee}
        getStageColor={getStageColor}
        calculateHours={calculateHours}
        calculateInvoiceAge={calculateInvoiceAge}
      />
    </div>
  );
};
