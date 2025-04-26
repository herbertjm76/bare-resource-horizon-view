
import React from "react";
import { StageHeader } from "./StageHeader";
import { StageForm } from "./StageForm";
import type { StageFee } from "../../../hooks/types/projectTypes";

interface StageCardProps {
  stageId: string;
  stageName: string;
  stageColor: string;
  stageFeeData: StageFee;
  billingOptions: Array<{ value: string; label: string }>;
  updateStageFee: (stageId: string, data: Partial<StageFee>) => void;
  calculateHours: (fee: string) => string;
  calculateInvoiceAge: (invoiceDate: Date | null) => string;
}

export const StageCard: React.FC<StageCardProps> = ({
  stageId,
  stageName,
  stageColor,
  stageFeeData,
  billingOptions,
  updateStageFee,
  calculateHours,
  calculateInvoiceAge,
}) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <StageHeader stageName={stageName} stageColor={stageColor} />
      <StageForm
        stageId={stageId}
        stageFeeData={stageFeeData}
        billingOptions={billingOptions}
        updateStageFee={updateStageFee}
        calculateHours={calculateHours}
        calculateInvoiceAge={calculateInvoiceAge}
      />
    </div>
  );
};
