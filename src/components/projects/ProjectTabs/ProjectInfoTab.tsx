
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';
import { Check, Percent } from 'lucide-react';
import { ProjectBasicInfo } from './components/ProjectBasicInfo';
import { ProjectManagerSelect } from './components/ProjectManagerSelect';
import { ProjectLocationInfo } from './components/ProjectLocationInfo';
import { ProjectStagesSelector } from './components/ProjectStagesSelector';

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
}

export const ProjectInfoTab: React.FC<ProjectInfoTabProps> = ({
  form,
  managers,
  countries,
  offices,
  officeStages,
  statusOptions,
  onChange,
}) => {
  const { company } = useCompany();
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  const checkProjectCodeUnique = async (code: string) => {
    if (!code.trim() || !company?.id) return;
    
    setIsCheckingCode(true);
    setCodeError(null);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('code')
        .eq('code', code)
        .eq('company_id', company.id)
        .limit(1);
      
      if (error) {
        console.error("Error checking project code:", error);
        toast.error("Failed to validate project code");
        return;
      }
      
      if (data && data.length > 0) {
        setCodeError(`Project code "${code}" already exists. Please use a unique code.`);
      }
    } catch (err) {
      console.error("Exception checking project code:", err);
    } finally {
      setIsCheckingCode(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value;
    onChange("code", newCode);
    
    if (codeError) setCodeError(null);
    
    const timer = setTimeout(() => {
      if (newCode.trim()) {
        checkProjectCodeUnique(newCode);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  };

  return (
    <div className="space-y-4 py-4">
      <ProjectBasicInfo
        code={form.code}
        name={form.name}
        codeError={codeError}
        isCheckingCode={isCheckingCode}
        onCodeChange={handleCodeChange}
        onNameChange={(e) => onChange("name", e.target.value)}
      />

      <ProjectManagerSelect
        value={form.manager}
        managers={managers}
        onChange={(value) => onChange("manager", value)}
      />

      <ProjectLocationInfo
        country={form.country}
        office={form.office}
        countries={countries}
        offices={offices}
        onCountryChange={(value) => onChange("country", value)}
        onOfficeChange={(value) => onChange("office", value)}
      />

      <div>
        <Label htmlFor="status" className="flex items-center gap-1">
          <Check className="w-4 h-4" />Status
        </Label>
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

      <div>
        <Label htmlFor="profit" className="flex items-center gap-1">
          <Percent className="w-4 h-4" />Target Profit %
        </Label>
        <Input
          id="profit"
          type="number"
          min="0"
          max="100"
          placeholder="30"
          value={form.profit}
          onChange={(e) => onChange("profit", e.target.value)}
          required
        />
      </div>

      <ProjectStagesSelector
        stages={form.stages}
        officeStages={officeStages}
        onChange={(stages) => onChange("stages", stages)}
      />
    </div>
  );
};
