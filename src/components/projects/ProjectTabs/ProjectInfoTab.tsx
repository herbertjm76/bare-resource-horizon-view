
import React, { useState } from 'react';
import { ProjectBasicInfo } from './components/ProjectBasicInfo';
import { ProjectManagerSelect } from './components/ProjectManagerSelect';
import { ProjectLocationInfo } from './components/ProjectLocationInfo';
import { ProjectStagesSelector } from './components/ProjectStagesSelector';
import { ProjectCurrentStageSelector } from './components/ProjectCurrentStageSelector';
import { RateCalculatorNew } from './components/RateCalculatorNew';
import { ProjectProfitRate } from './components/ProjectProfitRate';
import { ProjectDepartmentSelector } from './components/ProjectDepartmentSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRateCalculator } from '../hooks/useRateCalculator';

interface ProjectForm {
  code: string;
  name: string;
  manager: string;
  country: string;
  profit: string;
  avgRate?: string;
  status: string;
  office: string;
  current_stage: string;
  stages: string[];
  stageFees: Record<string, any>;
  stageApplicability?: Record<string, boolean>;
  department?: string;
}

interface ProjectInfoTabProps {
  form: ProjectForm;
  managers: Array<{ id: string; name: string }>;
  countries: string[];
  offices: Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>;
  officeStages: Array<{ id: string; name: string; color?: string }>;
  departments: Array<{ id: string; name: string }>;
  statusOptions: Array<{ label: string; value: string }>;
  onChange: (key: keyof ProjectForm, value: any) => void;
  updateStageApplicability?: (stageId: string, isChecked: boolean) => void;
  projectId?: string;
}

export const ProjectInfoTab: React.FC<ProjectInfoTabProps> = ({
  form,
  managers,
  countries,
  offices,
  officeStages,
  departments,
  statusOptions,
  onChange,
  updateStageApplicability,
  projectId
}) => {
  const {
    showRateCalc,
    setShowRateCalc,
    rateOptions,
    calculatorType,
    openRateCalculator,
    handleRateTypeChange
  } = useRateCalculator();

  return (
    <div className="space-y-6 py-4">
      {/* Required Fields Section */}
      <div className="space-y-4">
        <div className="pb-2 border-b">
          <h3 className="text-sm font-medium text-muted-foreground">Required Information</h3>
        </div>
        <ProjectBasicInfo
          code={form.code}
          name={form.name}
          codeError={null}
          isCheckingCode={false}
          onCodeChange={(e) => onChange("code", e.target.value)}
          onNameChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      {/* Optional Fields Section */}
      <div className="space-y-4">
        <div className="pb-2 border-b">
          <h3 className="text-sm font-medium text-muted-foreground">Additional Details (Optional)</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProjectManagerSelect
            value={form.manager}
            managers={managers}
            onChange={(value) => onChange("manager", value)}
          />

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select value={form.status} onValueChange={(value) => onChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status (defaults to Active)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not Selected</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ProjectLocationInfo
          country={form.country}
          office={form.office}
          countries={countries}
          offices={offices}
          onCountryChange={(value) => onChange("country", value)}
          onOfficeChange={(value) => onChange("office", value)}
        />

        <ProjectDepartmentSelector
          department={form.department}
          departments={departments}
          onDepartmentChange={(value) => onChange("department", value)}
        />

        <ProjectProfitRate
          profit={form.profit}
          avgRate={form.avgRate || ''}
          onProfitChange={(value) => onChange("profit", value)}
          onAvgRateChange={(value) => onChange("avgRate", value)}
          onCalculatorOpen={openRateCalculator}
        />

        <ProjectStagesSelector
          stages={form.stages}
          officeStages={officeStages}
          onChange={(stages) => onChange("stages", stages)}
        />

        <ProjectCurrentStageSelector
          currentStage={form.current_stage}
          selectedStages={form.stages}
          officeStages={officeStages}
          onChange={(stageId) => onChange("current_stage", stageId)}
        />
      </div>

      {showRateCalc && (
        <RateCalculatorNew
          options={rateOptions}
          type={calculatorType}
          onCancel={() => setShowRateCalc(false)}
          onApply={(avgRate) => {
            onChange("avgRate", avgRate);
            setShowRateCalc(false);
          }}
          onTypeChange={handleRateTypeChange}
        />
      )}
    </div>
  );
};
