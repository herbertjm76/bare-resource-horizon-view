
import type { FormState } from "../types/projectTypes";

export const useStageManagement = (form: FormState, setForm: React.Dispatch<React.SetStateAction<FormState>>) => {
  const updateStageFee = (stageId: string, data: Partial<FormState['stageFees'][string]>) => {
    setForm(prev => {
      let hours = prev.stageFees[stageId]?.hours ?? '';
      const feeVal = data.fee ?? prev.stageFees[stageId]?.fee ?? '';
      const avgRateVal = prev.avgRate;
      
      if ((data.fee || data.fee === '') && avgRateVal && parseFloat(avgRateVal) > 0 && parseFloat(feeVal) > 0) {
        hours = (parseFloat(feeVal) / parseFloat(avgRateVal)).toFixed(2);
      } else if (!parseFloat(feeVal) || !parseFloat(avgRateVal)) {
        hours = '';
      }

      let invoiceAge = prev.stageFees[stageId]?.invoiceAge ?? 0;
      const invoiceDate = typeof data.invoiceDate !== "undefined" ? data.invoiceDate : prev.stageFees[stageId]?.invoiceDate;
      
      if (invoiceDate instanceof Date && !isNaN(invoiceDate.getTime())) {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - invoiceDate.getTime());
        invoiceAge = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        invoiceAge = 0;
      }

      return {
        ...prev,
        stageFees: {
          ...prev.stageFees,
          [stageId]: {
            ...prev.stageFees[stageId],
            ...data,
            hours,
            invoiceAge,
          }
        }
      };
    });
  };

  const updateStageApplicability = (stageId: string, isApplicable: boolean) => {
    setForm(prev => ({
      ...prev,
      stageApplicability: {
        ...prev.stageApplicability,
        [stageId]: isApplicable
      }
    }));
  };

  return {
    updateStageFee,
    updateStageApplicability
  };
};
