import React, { useEffect, useState } from 'react';
import { ProjectBasicInfo } from './components/ProjectBasicInfo';
import { ProjectManagerSelect } from './components/ProjectManagerSelect';
import { ProjectLocationInfo } from './components/ProjectLocationInfo';
import { ProjectStagesSelector } from './components/ProjectStagesSelector';
import { ProjectCurrentStageSelector } from './components/ProjectCurrentStageSelector';
import { RateCalculatorNew } from './components/RateCalculatorNew';
import { ProjectProfitRate } from './components/ProjectProfitRate';
import { ProjectResourceOverview } from './components/ProjectResourceOverview';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRateCalculator } from '../hooks/useRateCalculator';
import { format, startOfWeek } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
}

interface ProjectInfoTabProps {
  form: ProjectForm;
  managers: Array<{ id: string; name: string }>;
  countries: string[];
  offices: Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>;
  officeStages: Array<{ id: string; name: string; color?: string }>;
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
  
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [resourceAllocations, setResourceAllocations] = useState<any[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState<boolean>(false);
  const { toast } = useToast();

  // Fetch resource allocations for the selected week
  useEffect(() => {
    if (!projectId) return;
    
    const fetchResourceAllocations = async () => {
      setIsLoadingResources(true);
      try {
        // Get Monday of the selected week
        const mondayOfWeek = startOfWeek(selectedWeek, { weekStartsOn: 1 });
        const weekStartDate = format(mondayOfWeek, 'yyyy-MM-dd');
        
        console.log("Fetching resources for project:", projectId, "week:", weekStartDate);
        
        // Query resource allocations
        const { data, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            id,
            resource_id,
            resource_type,
            hours,
            profiles:profiles(first_name, last_name, job_title)
          `)
          .eq('project_id', projectId)
          .eq('week_start_date', weekStartDate);
          
        if (error) {
          console.error("Error fetching resource allocations:", error);
          toast.error("Failed to load resource allocations");
          return;
        }
        
        console.log("Resource allocations:", data);
        setResourceAllocations(data || []);
      } catch (err) {
        console.error("Failed to load resource allocations:", err);
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoadingResources(false);
      }
    };
    
    fetchResourceAllocations();
  }, [projectId, selectedWeek, toast]);

  return (
    <div className="space-y-4 py-4">
      <ProjectBasicInfo
        code={form.code}
        name={form.name}
        codeError={null}
        isCheckingCode={false}
        onCodeChange={(e) => onChange("code", e.target.value)}
        onNameChange={(e) => onChange("name", e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ProjectManagerSelect
          value={form.manager}
          managers={managers}
          onChange={(value) => onChange("manager", value)}
        />

        <div>
          <Select value={form.status} onValueChange={(value) => onChange("status", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a status</SelectItem>
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

      {/* Add resource allocations section if project ID exists */}
      {projectId && (
        <ProjectResourceOverview 
          projectId={projectId}
          selectedWeek={selectedWeek}
          onWeekChange={setSelectedWeek}
          resourceAllocations={resourceAllocations}
          isLoading={isLoadingResources}
        />
      )}

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
