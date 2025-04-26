
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign } from 'lucide-react';
import { ProjectBasicInfo } from './components/ProjectBasicInfo';
import { ProjectManagerSelect } from './components/ProjectManagerSelect';
import { ProjectLocationInfo } from './components/ProjectLocationInfo';
import { ProjectStagesSelector } from './components/ProjectStagesSelector';
import { RateCalculatorNew } from './components/RateCalculatorNew';

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
  updateStageApplicability
}) => {
  const { company } = useCompany();
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [showRateCalc, setShowRateCalc] = useState(false);
  const [rateOptions, setRateOptions] = useState<Array<{ id: string; name: string; rate?: number; country?: string }>>([]);
  const [calculatorType, setCalculatorType] = useState<'roles' | 'locations'>('roles');

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

  const openRateCalculator = async () => {
    if (!company?.id) {
      toast.error("Company context not found");
      return;
    }

    await loadRateOptions(calculatorType);
    setShowRateCalc(true);
  };

  const loadRateOptions = async (type: 'roles' | 'locations') => {
    try {
      console.log(`Loading ${type} data for rate calculator...`);
      let fetchedData = [];
      
      if (type === 'roles') {
        const { data, error } = await supabase
          .from('office_roles')
          .select('id, name, code')
          .eq('company_id', company?.id);
          
        if (error) {
          console.error(`Error fetching roles:`, error);
          toast.error(`Failed to load roles data for rate calculator`);
          return;
        }
        fetchedData = data || [];
      } else {
        const { data, error } = await supabase
          .from('office_locations')
          .select('id, city as name, country')
          .eq('company_id', company?.id);
          
        if (error) {
          console.error(`Error fetching locations:`, error);
          toast.error(`Failed to load locations data for rate calculator`);
          return;
        }
        fetchedData = data || [];
      }

      console.log(`Fetched ${fetchedData.length} ${type} records:`, fetchedData);
      
      if (fetchedData.length > 0) {
        const enrichedOptions = await Promise.all(fetchedData.map(async (option) => {
          try {
            // This is the critical fix: type parameter should be either 'role' or 'location' (singular)
            // instead of 'roles' or 'locations' (plural)
            const rateType = type === 'roles' ? 'role' : 'location';
            
            console.log(`Fetching rates for ${type} ${option.name}, reference_id: ${option.id}, using type: ${rateType}`);
            
            const { data: rateData, error } = await supabase
              .from('office_rates')
              .select('value')
              .eq('reference_id', option.id)
              .eq('type', rateType)
              .limit(1);

            if (error) {
              console.error(`Error fetching rate for ${type} ${option.name}:`, error);
              return { ...option, rate: 0 };
            }

            const rate = rateData && rateData.length > 0 ? Number(rateData[0].value) : 0;
            console.log(`Rate for ${option.name}: ${rate}`);
            
            return {
              ...option,
              rate
            };
          } catch (err) {
            console.error(`Exception fetching rate for ${option.name}:`, err);
            return { ...option, rate: 0 };
          }
        }));

        console.log(`Enriched ${type} options:`, enrichedOptions);
        setRateOptions(enrichedOptions);
      } else {
        setRateOptions([]);
        toast.info(`No ${type} found for this company`);
      }
    } catch (err) {
      console.error(`Error in loadRateOptions for ${type}:`, err);
      toast.error(`Failed to load ${type} data for rate calculator`);
      setRateOptions([]);
    }
  };

  const handleRateTypeChange = async (type: 'roles' | 'locations') => {
    setCalculatorType(type);
    await loadRateOptions(type);
  };

  const handleApplyRate = (avgRate: string) => {
    onChange("avgRate", avgRate);
    setShowRateCalc(false);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ProjectManagerSelect
          value={form.manager}
          managers={managers}
          onChange={(value) => onChange("manager", value)}
        />

        <div>
          <Label htmlFor="status" className="block">Status</Label>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="profit" className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />Target Profit
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

        <div>
          <Label htmlFor="avgRate" className="flex items-center gap-1">
            <Calculator className="w-4 h-4" />Average Rate
          </Label>
          <div className="flex gap-2">
            <Input
              id="avgRate"
              type="number"
              placeholder="Enter rate"
              value={form.avgRate || ''}
              onChange={(e) => onChange("avgRate", e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={openRateCalculator}
              title="Calculate Average Rate"
            >
              <Calculator className="w-4 h-4 mr-1" />
              Calculate
            </Button>
          </div>
        </div>
      </div>

      <ProjectStagesSelector
        stages={form.stages}
        officeStages={officeStages}
        onChange={(stages) => onChange("stages", stages)}
      />

      {showRateCalc && (
        <RateCalculatorNew
          options={rateOptions}
          type={calculatorType}
          onCancel={() => setShowRateCalc(false)}
          onApply={handleApplyRate}
          onTypeChange={handleRateTypeChange}
        />
      )}
    </div>
  );
};
