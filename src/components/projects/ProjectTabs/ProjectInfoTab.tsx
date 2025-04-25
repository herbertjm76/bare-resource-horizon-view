
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toggle } from '@/components/ui/toggle';
import { Check } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">Project Code</Label>
          <Input
            id="code"
            placeholder="P001"
            value={form.code}
            onChange={handleCodeChange}
            required
            className={cn("h-11 rounded-lg border-gray-200", codeError ? "border-red-500" : "")}
          />
          {isCheckingCode && (
            <p className="text-xs text-muted-foreground mt-1">Checking code availability...</p>
          )}
          {codeError && (
            <p className="text-xs text-red-500 mt-1">{codeError}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Project Name</Label>
          <Input
            id="name"
            placeholder="New Project"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            required
            className="h-11 rounded-lg border-gray-200"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="manager" className="text-sm font-medium">Project Manager</Label>
        <Select value={form.manager} onValueChange={(value) => onChange("manager", value)}>
          <SelectTrigger className="h-11 rounded-lg border-gray-200">
            <SelectValue placeholder="Select a project manager" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="none">Select a project manager</SelectItem>
            <SelectItem value="not_assigned">Not Assigned</SelectItem>
            {managers.map((manager) => (
              <SelectItem key={manager.id} value={manager.id}>
                {manager.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium">Country</Label>
          <Select 
            value={form.country}
            onValueChange={(value) => onChange("country", value)}
            required
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-200">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="none">Select a country</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="office" className="text-sm font-medium">Office</Label>
          <Select
            value={form.office}
            onValueChange={(value) => onChange("office", value)}
            required
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-200">
              <SelectValue placeholder="Select an office" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="none">Select an office</SelectItem>
              {offices.map((office) => (
                <SelectItem key={office.id} value={office.id}>
                  {office.emoji ? `${office.emoji} ` : ''}{office.city}, {office.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="current_stage" className="text-sm font-medium">Current Stage</Label>
          <Select
            value={form.current_stage || "none"}
            onValueChange={(value) => onChange("current_stage", value)}
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-200">
              <SelectValue placeholder="Select current stage" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="none">Not Selected</SelectItem>
              {officeStages.map((stage) => (
                <SelectItem key={stage.id} value={stage.name}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">Status</Label>
          <Select
            value={form.status || "none"}
            onValueChange={(value) => onChange("status", value)}
            required
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-200">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
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

      <div className="space-y-2">
        <Label htmlFor="profit" className="text-sm font-medium">Target Profit %</Label>
        <Input
          id="profit"
          type="number"
          min="0"
          max="100"
          placeholder="30"
          value={form.profit}
          onChange={(e) => onChange("profit", e.target.value)}
          required
          className="h-11 rounded-lg border-gray-200"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Project Stages</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {officeStages.map((stage) => {
            const isSelected = form.stages.includes(stage.id);
            const stageColor = stage.color || '#E5DEFF'; // Default color if none set
            
            return (
              <Toggle
                key={stage.id}
                pressed={isSelected}
                onPressedChange={(pressed) => {
                  const newStages = pressed
                    ? [...form.stages, stage.id]
                    : form.stages.filter(s => s !== stage.id);
                  onChange('stages', newStages);
                }}
                className={`w-full justify-start h-11 rounded-lg border ${
                  isSelected 
                    ? 'text-white hover:opacity-90' 
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
                style={{
                  backgroundColor: isSelected ? stageColor : 'transparent',
                  borderColor: isSelected ? stageColor : undefined
                }}
              >
                {stage.name}
                {isSelected && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </Toggle>
            );
          })}
        </div>
        
        {officeStages.length === 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            No stages defined. Please add stages in office settings.
          </p>
        )}
      </div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
