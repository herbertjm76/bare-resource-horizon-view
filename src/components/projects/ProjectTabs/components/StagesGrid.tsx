
import React from "react";
import { StageCard } from "./stage/StageCard";
import type { StageFee } from "../../../../components/projects/hooks/types/projectTypes";
import { toast } from "sonner";
import { logger } from '@/utils/logger';

interface Stage {
  id: string;
  name: string;
  color?: string;
}

interface StagesGridProps {
  selectedStages: Stage[];
  stageFees: Record<string, StageFee>;
  billingOptions: Array<{ value: string; label: string }>;
  updateStageFee: (stageId: string, data: Partial<StageFee>) => void;
  getStageColor: (stageId: string) => string;
  calculateHours: (fee: string) => string;
  calculateInvoiceAge: (invoiceDate: Date | null) => string;
  isDataLoaded: boolean;
}

export const StagesGrid: React.FC<StagesGridProps> = ({
  selectedStages,
  stageFees,
  billingOptions,
  updateStageFee,
  getStageColor,
  calculateHours,
  calculateInvoiceAge,
  isDataLoaded
}) => {
  logger.debug("StagesGrid rendering with stages:", selectedStages);
  logger.debug("StagesGrid stageFees:", stageFees);
  
  // Show warning if no stages are selected
  React.useEffect(() => {
    if (isDataLoaded && selectedStages.length === 0) {
      toast.warning("No stages selected for this project", {
        id: "no-stages-warning"
      });
    }
  }, [selectedStages, isDataLoaded]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {selectedStages.length === 0 ? (
        <div className="col-span-2 p-6 text-center text-muted-foreground">
          No stages selected. Please select stages in the Project Info tab.
        </div>
      ) : (
        selectedStages.map((stage) => {
          // Make sure we have fee data for this stage
          const stageFeeData = stageFees[stage.id] || {
            fee: '',
            billingMonth: null,
            status: 'Not Billed',
            invoiceDate: null,
            hours: '',
            invoiceAge: 0,
            currency: 'USD'
          };
          
          const stageColor = getStageColor(stage.id);
          
          logger.debug(`Rendering stage ${stage.id} (${stage.name}) with data:`, stageFeeData);
          
          return (
            <StageCard
              key={stage.id}
              stageId={stage.id}
              stageName={stage.name}
              stageColor={stageColor}
              stageFeeData={stageFeeData}
              billingOptions={billingOptions}
              updateStageFee={updateStageFee}
              calculateHours={calculateHours}
              calculateInvoiceAge={calculateInvoiceAge}
            />
          );
        })
      )}
    </div>
  );
};
