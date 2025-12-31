
import React, { useEffect } from "react";
import { StagesGrid } from "./components/StagesGrid";
import type { FormState } from "../hooks/types/projectTypes";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

interface ProjectStageFeesTabProps {
  form: FormState;
  officeStages: Array<{ id: string; name: string; color?: string }>;
  updateStageFee: (stageId: string, data: Partial<FormState['stageFees'][string]>) => void;
  isDataLoaded: boolean;
}

export const ProjectStageFeesTab: React.FC<ProjectStageFeesTabProps> = ({
  form,
  officeStages,
  updateStageFee,
  isDataLoaded
}) => {
  logger.debug("ProjectStageFeesTab - form:", form);
  logger.debug("ProjectStageFeesTab - stages:", form.stages);
  logger.debug("ProjectStageFeesTab - stageFees:", form.stageFees);
  logger.debug("ProjectStageFeesTab - officeStages:", officeStages);
  logger.debug("ProjectStageFeesTab - isDataLoaded:", isDataLoaded);

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
    if (!fee || !form.avgRate || parseFloat(String(form.avgRate)) === 0) return '';
    const feeValue = parseFloat(fee);
    const rateValue = parseFloat(String(form.avgRate));
    if (isNaN(feeValue) || isNaN(rateValue) || rateValue === 0) return '';
    return (feeValue / rateValue).toFixed(2);
  };

  const getStageColor = (stageId: string): string => {
    const stage = officeStages.find(s => s.id === stageId);
    return stage?.color || "#E5DEFF";
  };

  // Get the actual office stage objects for the selected stage IDs
  const selectedStages = officeStages.filter(stage => form.stages.includes(stage.id));
  const billingOptions = generateYearMonths();

  logger.debug("Selected stages for fees:", selectedStages);
  
  if (isDataLoaded) {
    logger.debug("Stage fees loaded:", form.stageFees);
  } else {
    logger.debug("Stage fees not loaded yet");
  }

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
        isDataLoaded={isDataLoaded}
      />
    </div>
  );
};
