
import React, { useMemo } from 'react';
import { CurrentStageIndicator } from '../components/CurrentStageIndicator';
import { FinancialOverviewCards } from './components/FinancialOverviewCards';
import { ProgressIndicatorsSection } from './components/ProgressIndicatorsSection';
import { BudgetConfigurationSection } from './components/BudgetConfigurationSection';
import { ContractTimelineSection } from './components/ContractTimelineSection';
import { FinancialHealthSection } from './components/FinancialHealthSection';
import type { FinancialMetrics } from '../hooks/useProjectFinancialMetrics';

interface ProjectFinancialTabProps {
  form: any;
  onChange: (key: string, value: any) => void;
  financialMetrics?: FinancialMetrics;
  officeStages?: Array<{ id: string; name: string; color?: string }>;
}

export const ProjectFinancialTab: React.FC<ProjectFinancialTabProps> = ({
  form,
  onChange,
  financialMetrics,
  officeStages = []
}) => {
  // Calculate derived budget amount from stage fees
  const derivedBudgetAmount = useMemo((): number => {
    if (!form.stageFees) return 0;
    return (Object.values(form.stageFees) as unknown[]).reduce<number>((total: number, stage: unknown): number => {
      // Type guard to ensure stage is an object with fee property
      if (stage && typeof stage === 'object' && stage !== null) {
        const stageObj = stage as { fee?: string | number };
        const feeValue = stageObj.fee || '0';
        const fee = parseFloat(String(feeValue));
        return total + (isNaN(fee) ? 0 : fee);
      }
      return total;
    }, 0);
  }, [form.stageFees]);

  // Calculate budget hours from derived budget and blended rate
  const derivedBudgetHours = useMemo((): number => {
    const blendedRateValue = form.blended_rate || form.avgRate || '0';
    const rate = parseFloat(String(blendedRateValue));
    return rate > 0 ? derivedBudgetAmount / rate : 0;
  }, [derivedBudgetAmount, form.blended_rate, form.avgRate]);

  const consumedHours = parseFloat(String(form.consumed_hours || '0'));
  const hoursProgress = derivedBudgetHours > 0 ? (consumedHours / derivedBudgetHours) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Current Stage Progress */}
      {form.current_stage && officeStages.length > 0 && (
        <CurrentStageIndicator
          currentStage={form.current_stage}
          allStages={officeStages}
          completionPercentage={hoursProgress}
        />
      )}

      {/* Financial Overview Cards */}
      <FinancialOverviewCards
        derivedBudgetAmount={derivedBudgetAmount}
        consumedHours={consumedHours}
        derivedBudgetHours={derivedBudgetHours}
        financialMetrics={financialMetrics}
      />

      {/* Progress Indicators */}
      <ProgressIndicatorsSection
        consumedHours={consumedHours}
        derivedBudgetHours={derivedBudgetHours}
        derivedBudgetAmount={derivedBudgetAmount}
        financialMetrics={financialMetrics}
      />

      {/* Budget Configuration */}
      <BudgetConfigurationSection
        derivedBudgetAmount={derivedBudgetAmount}
        derivedBudgetHours={derivedBudgetHours}
        form={form}
        onChange={onChange}
      />

      {/* Contract Timeline */}
      <ContractTimelineSection
        form={form}
        onChange={onChange}
      />

      {/* Enhanced Financial Health */}
      {financialMetrics && (
        <FinancialHealthSection
          financialMetrics={financialMetrics}
          form={form}
          derivedBudgetHours={derivedBudgetHours}
          consumedHours={consumedHours}
        />
      )}
    </div>
  );
};
