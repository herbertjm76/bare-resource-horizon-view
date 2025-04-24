import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ProjectInfoTabProps {
  form: ProjectForm;
  managers: Array<{ id: string; name: string }>;
  countries: string[];
  offices: Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>;
  officeStages: Array<{ id: string; name: string }>;
  statusOptions: Array<{ label: string; value: string }>;
  onChange: (key: keyof ProjectForm, value: any) => void;
  updateStageApplicability: (stageId: string, isChecked: boolean) => void;
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
    
    // Clear any existing error when the user types
    if (codeError) setCodeError(null);
    
    // Debounce the validation to avoid too many requests
    const timer = setTimeout(() => {
      if (newCode.trim()) {
        checkProjectCodeUnique(newCode);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  };

  return (
    <div className="space-y-4 py-4">
      {/* Project Code & Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="code">Project Code</Label>
          <Input
            id="code"
            placeholder="P001"
            value={form.code}
            onChange={handleCodeChange}
            required
            className={codeError ? "border-red-500" : ""}
          />
          {isCheckingCode && (
            <p className="text-xs text-muted-foreground mt-1">Checking code availability...</p>
          )}
          {codeError && (
            <p className="text-xs text-red-500 mt-1">{codeError}</p>
          )}
        </div>
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            placeholder="New Project"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Project Manager */}
      <div>
        <Label htmlFor="manager">Project Manager</Label>
        <Select value={form.manager} onValueChange={(value) => onChange("manager", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a project manager" />
          </SelectTrigger>
          <SelectContent>
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

      {/* Country & Office */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country</Label>
          <Select 
            value={form.country}
            onValueChange={(value) => onChange("country", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a country</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="office">Office</Label>
          <Select
            value={form.office}
            onValueChange={(value) => onChange("office", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an office" />
            </SelectTrigger>
            <SelectContent>
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

      {/* Current Stage & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="current_stage">Current Stage</Label>
          <Select
            value={form.current_stage || "none"}
            onValueChange={(value) => onChange("current_stage", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select current stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not Selected</SelectItem>
              {officeStages.map((stage) => (
                <SelectItem key={stage.id} value={stage.name}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={form.status || "none"}
            onValueChange={(value) => onChange("status", value)}
            required
          >
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

      {/* Profit */}
      <div>
        <Label htmlFor="profit">Target Profit %</Label>
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

      {/* Project Stages */}
      <div className="space-y-4">
        <Label>Project Stages</Label>
        {officeStages.map((stage) => {
          const isSelected = form.stages.includes(stage.id);
          return (
            <div key={stage.id} className="flex items-center space-x-4">
              <Checkbox
                id={`stage-${stage.id}`}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  const newStages = checked
                    ? [...form.stages, stage.id]
                    : form.stages.filter(s => s !== stage.id);
                  onChange('stages', newStages);
                }}
              />
              <Label htmlFor={`stage-${stage.id}`}>{stage.name}</Label>
              
              {isSelected && (
                <Checkbox
                  id={`stage-applicable-${stage.id}`}
                  checked={form.stageApplicability?.[stage.id] ?? true}
                  onCheckedChange={(checked) => updateStageApplicability(stage.id, checked)}
                />
              )}
              {isSelected && (
                <Label htmlFor={`stage-applicable-${stage.id}`}>Is Applicable</Label>
              )}
            </div>
          );
        })}
      </div>
      
      {officeStages.length === 0 && (
        <p className="text-sm text-muted-foreground mt-2">
          No stages defined. Please add stages in office settings.
        </p>
      )}
    </div>
  );
};
