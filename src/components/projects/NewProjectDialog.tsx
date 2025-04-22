
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { PlusCircle, Percent, Users, FileText, Code, Building, MapPin, CheckSquare, Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';
import type { Database } from "@/integrations/supabase/types";

type RoleOption = { id: string; name: string };
type OfficeOption = { id: string; city: string; country: string };
type ProjectStageOption = { id: string; stage_name: string; };
type OfficeStageOption = { id: string; name: string };

// Define the valid project status values based on the database enum
type ProjectStatus = Database["public"]["Enums"]["project_status"];

const statusOptions = [
  { label: "Not started", value: "Planning" as ProjectStatus },
  { label: "On-going", value: "In Progress" as ProjectStatus },
  { label: "Completed", value: "Complete" as ProjectStatus },
  { label: "On hold", value: "On Hold" as ProjectStatus },
];

type NewProjectForm = {
  code: string;
  name: string;
  manager: string;
  country: string;
  profit: string;
  avgRate: string;
  status: ProjectStatus | "";
  office: string;
  stages: string[];
  client?: string;
  dueDate?: string;
};

export const NewProjectDialog: React.FC<{ onProjectCreated?: () => void }> = ({ onProjectCreated }) => {
  const [open, setOpen] = useState(false);
  const [showRateCalc, setShowRateCalc] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const { company } = useCompany();

  const [form, setForm] = useState<NewProjectForm>({
    code: "",
    name: "",
    manager: "",
    country: "",
    profit: "",
    avgRate: "",
    status: "",
    office: "",
    stages: [],
    client: "",
    dueDate: "",
  });

  const [managers, setManagers] = useState<RoleOption[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [offices, setOffices] = useState<OfficeOption[]>([]);
  const [projectStages, setProjectStages] = useState<ProjectStageOption[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string; code: string; }[]>([]);
  const [roleNumbers, setRoleNumbers] = useState<{ [roleId: string]: number }>({});
  const [officeStages, setOfficeStages] = useState<OfficeStageOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data: mgrs } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role')
          .eq('role', 'member');

        setManagers(Array.isArray(mgrs)
          ? mgrs.map((u) => ({ id: u.id, name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() }))
          : []);

        const { data: areas } = await supabase
          .from('project_areas')
          .select('name');
        
        setCountries(Array.from(new Set(Array.isArray(areas) 
          ? areas.map(a => a.name).filter(Boolean) 
          : [])) as string[]);

        const { data: off } = await supabase
          .from('office_locations')
          .select('id, city, country');
        setOffices(Array.isArray(off) ? off : []);

        const { data: projectStagesData } = await supabase
          .from('project_stages')
          .select('id, stage_name');
        setProjectStages(Array.isArray(projectStagesData) ? projectStagesData : []);

        const { data: officeRoles } = await supabase
          .from('office_roles')
          .select('id, name, code');
        setRoles(Array.isArray(officeRoles) ? officeRoles : []);

        const { data: officeStagesData } = await supabase
          .from('office_stages')
          .select('id, name');
        setOfficeStages(Array.isArray(officeStagesData) ? officeStagesData : []);
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Failed to load project options");
      }
    })();
  }, []);

  const handleChange = (key: keyof NewProjectForm, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const calculateAvgRate = () => {
    let total = 0;
    let count = 0;
    roles.forEach(role => {
      const num = roleNumbers[role.id] || 0;
      if (num > 0) {
        const dummyRate = 50;
        total += dummyRate * num;
        count += num;
      }
    });
    return count > 0 ? (total / count).toFixed(2) : '';
  };

  const validateStep = (step: number): boolean => {
    switch(step) {
      case 1: // Basic info
        return !!form.code && !!form.name;
      case 2: // Details
        return !!form.country && !!form.profit && !!form.avgRate && !!form.status && !!form.office;
      case 3: // Stages
        return form.stages.length > 0;
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill all required fields in this section");
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.name || !form.country || !form.profit || !form.avgRate || !form.status || !form.office || form.stages.length === 0) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!company || !company.id) {
      toast.error('No company found for your user. Cannot create project.');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Submitting project with data:", {
        code: form.code,
        name: form.name,
        company_id: company.id,
        country: form.country,
        target_profit_percentage: form.profit ? Number(form.profit) : null,
        office_id: form.office,
        status: form.status,
        project_manager_id: form.manager === "not_assigned" ? null : (form.manager || null)
      });
      
      const { error } = await supabase.from('projects').insert({
        code: form.code,
        name: form.name,
        company_id: company.id,
        project_manager_id: form.manager === "not_assigned" ? null : (form.manager || null),
        office_id: form.office,
        status: form.status,
        country: form.country,
        target_profit_percentage: form.profit ? Number(form.profit) : null
        // Removed client and dueDate fields as they're not in the schema
      });
      
      if (error) {
        console.error("Supabase error inserting project:", error);
        toast.error('Failed to create project: ' + error.message);
        return;
      }

      setOpen(false);
      toast.success('Project successfully created!');
      setForm({
        code: "", name: "", manager: "", country: "", 
        profit: "", avgRate: "", status: "", office: "", stages: [],
        client: "", dueDate: "",
      });
      setCurrentStep(1);
      if (typeof onProjectCreated === 'function') {
        onProjectCreated();
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    return (
      <>
        {
          (() => {
            switch (currentStep) {
              case 1:
                return (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-[#6E59A5]">Project Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
                          <Code className="w-4 h-4" />Project Code<span className="text-destructive">*</span>
                        </label>
                        <Input 
                          value={form.code} 
                          onChange={e => handleChange('code', e.target.value)} 
                          required 
                          placeholder="Enter Project Code" 
                          className="text-base"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
                          <FileText className="w-4 h-4" />Project Name<span className="text-destructive">*</span>
                        </label>
                        <Input 
                          value={form.name} 
                          onChange={e => handleChange('name', e.target.value)} 
                          required 
                          placeholder="Enter Project Name"
                          className="text-base" 
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4" />Project Manager<span className="text-destructive">*</span>
                        </label>
                        <Select value={form.manager} onValueChange={v => handleChange('manager', v)}>
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Select Manager" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_assigned">Not Assigned</SelectItem>
                            {managers.map(m => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                );
              case 2:
                return (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-[#6E59A5]">Project Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
                          <MapPin className="w-4 h-4" />Project Country<span className="text-destructive">*</span>
                        </label>
                        <Select value={form.country} onValueChange={v => handleChange('country', v)}>
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
                          <Percent className="w-4 h-4" />Target Profit %<span className="text-destructive">*</span>
                        </label>
                        <Input 
                          value={form.profit} 
                          type="number" 
                          onChange={e => handleChange('profit', e.target.value)} 
                          required 
                          placeholder="Enter % Profit"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
                          <CheckSquare className="w-4 h-4" />Project Status<span className="text-destructive">*</span>
                        </label>
                        <Select value={form.status} onValueChange={v => handleChange('status', v)}>
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
                          <Building className="w-4 h-4" />Office<span className="text-destructive">*</span>
                        </label>
                        <Select value={form.office} onValueChange={v => handleChange('office', v)}>
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Select Office" />
                          </SelectTrigger>
                          <SelectContent>
                            {offices.map(o => (
                              <SelectItem key={o.id} value={o.id}>
                                {`${o.city}, ${o.country}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-semibold mb-1 flex items-center gap-1 text-sm">
                          <Calculator className="w-4 h-4" />Average Rate<span className="text-destructive">*</span>
                        </label>
                        <div className="flex gap-2">
                          <Input 
                            value={form.avgRate} 
                            type="number" 
                            onChange={e => handleChange('avgRate', e.target.value)} 
                            required 
                            placeholder="Enter AVG Rate"
                            className="text-base" 
                          />
                          <Button type="button" variant="outline" onClick={() => setShowRateCalc(true)} title="Calculate Avg Rate">
                            <Calculator className="w-4 h-4 mr-2" />
                            Calculate
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click Calculate to use the rate calculator
                        </p>
                      </div>
                    </div>
                  </div>
                );
              case 3:
                return (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-[#6E59A5]">Project Stages</h3>
                    <div>
                      <div className="font-semibold mb-3 flex items-center gap-2 text-sm">
                        <CheckSquare className="w-4 h-4" />Select Project Stages<span className="text-destructive">*</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-1">
                        {officeStages.map(stage => (
                          <label className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted/50 transition-colors" key={stage.id}>
                            <Checkbox
                              checked={form.stages.includes(stage.id)}
                              onCheckedChange={checked => {
                                handleChange(
                                  'stages',
                                  checked
                                    ? [...form.stages, stage.id]
                                    : form.stages.filter(s => s !== stage.id)
                                );
                              }}
                            />
                            <span className="text-base">{stage.name}</span>
                          </label>
                        ))}
                      </div>
                      {officeStages.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No project stages available</p>
                      )}
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })()
        }
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { 
      if (!o) {
        setCurrentStep(1);
      }
      setOpen(o); 
      setShowRateCalc(false); 
    }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Add New Project
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mb-1
                  ${i + 1 === currentStep 
                    ? 'bg-[#6E59A5] text-white border-[#6E59A5]' 
                    : i + 1 < currentStep 
                      ? 'bg-[#D6BCFA] border-[#6E59A5] text-[#6E59A5]' 
                      : 'bg-white border-gray-300 text-gray-500'}`}
              >
                {i + 1}
              </div>
              <div className={`text-xs font-medium ${i + 1 === currentStep ? 'text-[#6E59A5]' : 'text-gray-500'}`}>
                {i === 0 ? 'Info' : i === 1 ? 'Details' : 'Stages'}
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={onSubmit}>
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={goToPrevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button type="button" variant="default" onClick={goToNextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" variant="default" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            )}
          </div>
        </form>
        
        {showRateCalc && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <Card className="p-6 max-w-lg mx-auto relative z-50 shadow-xl">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#6E59A5]">
                <Calculator className="w-5 h-5" />Average Rate Calculator
              </h2>
              
              <p className="text-sm text-muted-foreground mb-4">
                Specify how many people per role will work on this project to calculate the average rate.
              </p>
              
              <div className="bg-muted/30 p-4 rounded-md space-y-3 mb-6">
                {roles.map(role => (
                  <div className="flex items-center gap-3" key={role.id}>
                    <span className="w-36 font-medium">{role.name}</span>
                    <Input
                      type="number"
                      value={roleNumbers[role.id] || ''}
                      min={0}
                      onChange={e => setRoleNumbers(rns => ({
                        ...rns,
                        [role.id]: Number(e.target.value)
                      }))}
                      placeholder="# People"
                      className="w-28"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mb-6 p-3 border rounded-md bg-[#F8F4FF]">
                <div className="flex justify-between">
                  <span className="font-medium">Calculated Average Rate:</span>
                  <span className="text-[#6E59A5] font-bold text-lg">${calculateAvgRate() || '--'}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">(Using dummy rates for demonstration)</p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowRateCalc(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleChange('avgRate', calculateAvgRate());
                    setShowRateCalc(false);
                  }}
                  type="button"
                  variant="default"
                  disabled={!calculateAvgRate()}
                >
                  Apply Rate
                </Button>
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
