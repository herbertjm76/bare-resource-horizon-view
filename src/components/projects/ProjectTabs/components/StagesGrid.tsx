
import React from "react";
import { StageCard } from "./stage/StageCard";
import type { StageFee } from "../../../../components/projects/hooks/types/projectTypes";

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
}

export const StagesGrid: React.FC<StagesGridProps> = ({
  selectedStages,
  stageFees,
  billingOptions,
  updateStageFee,
  getStageColor,
  calculateHours,
  calculateInvoiceAge,
}) => {
  console.log("StagesGrid rendering with stages:", selectedStages);
  console.log("StagesGrid stageFees:", stageFees);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {selectedStages.map((stage) => {
        const stageFeeData = stageFees[stage.id] || {
          fee: '',
          billingMonth: null,
          status: 'Not Billed',
          invoiceDate: null,
          hours: '',
          invoiceAge: '0',
          currency: 'USD'
        };
        
        const stageColor = getStageColor(stage.id);
        
        console.log(`Rendering stage ${stage.id} (${stage.name}) with data:`, stageFeeData);
        
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
      })}
    </div>
  );
};
