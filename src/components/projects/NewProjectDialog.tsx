import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';
import type { Database } from "@/integrations/supabase/types";
import NewProjectStep1Info from "./NewProjectStep1Info";
import NewProjectStep2Details from "./NewProjectStep2Details";
import NewProjectStep3Stages from "./NewProjectStep3Stages";
import NewProjectRateCalculator from "./NewProjectRateCalculator";

type RoleOption = { id: string; name: string };
type OfficeOption = { id: string; city: string; country: string; code?: string; emoji?: string };
type ProjectStageOption = { id: string; stage_name: string; };
type OfficeStageOption = { id: string; name: string; };

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
    const fetchData = async () => {
      console.log("Fetching data for new project dialog");

      try {
        const { data: mgrs, error: mgrsError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role')
          .eq('role', 'member');

        if (mgrsError) {
          console.error("Error fetching managers:", mgrsError);
          toast.error("Failed to load manager options");
        } else {
          setManagers(Array.isArray(mgrs)
            ? mgrs.map((u) => ({ id: u.id, name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() }))
            : []);
        }

        const { data: projectAreas, error: areasError } = await supabase
          .from('project_areas')
          .select('name');
        if (areasError) {
          console.error("Error fetching project areas:", areasError);
          toast.error("Failed to load country options");
        } else {
          const areaNames = Array.from(new Set(Array.isArray(projectAreas)
            ? projectAreas.map(a => a.name).filter(Boolean)
            : [])) as string[];
          setCountries(areaNames);
        }

        const { data: locations, error: locationsError } = await supabase
          .from('office_locations')
          .select('id, city, country, code, emoji');
        if (locationsError) {
          console.error("Error fetching office locations:", locationsError);
          toast.error("Failed to load office options");
        } else {
          setOffices(Array.isArray(locations) ? locations : []);
        }

        const { data: projectStagesData, error: projectStagesError } = await supabase
          .from('project_stages')
          .select('id, stage_name');
        if (projectStagesError) {
          console.error("Error fetching project stages:", projectStagesError);
          toast.error("Failed to load project stage options");
        } else {
          setProjectStages(Array.isArray(projectStagesData) ? projectStagesData : []);
        }

        const { data: officeRoles, error: officeRolesError } = await supabase
          .from('office_roles')
          .select('id, name, code');
        if (officeRolesError) {
          console.error("Error fetching office roles:", officeRolesError);
          toast.error("Failed to load office roles");
        } else {
          setRoles(Array.isArray(officeRoles) ? officeRoles : []);
        }

        const { data: officeRates, error: officeRatesError } = await supabase
          .from('office_rates')
          .select('id, type, value, unit, reference_id');
        if (officeRatesError) {
          console.error("Error fetching office rates:", officeRatesError);
          toast.error("Failed to load office rates");
        } else {
          // Optional: can set in state if you want to show/use them in project dialog
          // console.log('Office rates:', officeRates);
        }

        const { data: officeHolidays, error: officeHolidaysError } = await supabase
          .from('office_holidays')
          .select('id, name, date');
        if (officeHolidaysError) {
          console.error("Error fetching office holidays:", officeHolidaysError);
          toast.error("Failed to load office holiday options");
        } else {
          // Optional: can set in state if you want to show/use them in project dialog
          // console.log('Office holidays:', officeHolidays);
        }

        const { data: officeStagesData, error: officeStagesError } = await supabase
          .from('office_stages')
          .select('id, name');
        if (officeStagesError) {
          console.error("Error fetching office stages:", officeStagesError);
          toast.error("Failed to load office stages");
        } else {
          setOfficeStages(Array.isArray(officeStagesData) ? officeStagesData : []);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Failed to load project options");
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

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
      case 1:
        return !!form.code && !!form.name;
      case 2:
        return !!form.country && !!form.profit && !!form.avgRate && !!form.status && !!form.office;
      case 3:
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
      const { data, error } = await supabase.from('projects').insert({
        code: form.code,
        name: form.name,
        company_id: company.id,
        project_manager_id: form.manager === "not_assigned" ? null : (form.manager || null),
        office_id: form.office,
        status: form.status,
        country: form.country,
        target_profit_percentage: form.profit ? Number(form.profit) : null
      }).select();
      
      if (error) {
        toast.error('Failed to create project: ' + error.message);
        return;
      }

      setOpen(false);
      toast.success('Project successfully created!');
      setForm({
        code: "", name: "", manager: "", country: "", 
        profit: "", avgRate: "", status: "", office: "", stages: [],
      });
      setCurrentStep(1);
      if (typeof onProjectCreated === 'function') {
        onProjectCreated();
      }
    } catch (error) {
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { 
      if (!o) setCurrentStep(1);
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
          {currentStep === 1 && (
            <NewProjectStep1Info 
              form={form}
              managers={managers}
              onChange={handleChange}
            />
          )}
          {currentStep === 2 && (
            <NewProjectStep2Details
              form={form}
              countries={countries}
              offices={offices}
              statusOptions={statusOptions}
              onChange={handleChange}
              onShowRateCalc={() => setShowRateCalc(true)}
            />
          )}
          {currentStep === 3 && (
            <NewProjectStep3Stages
              stages={form.stages}
              setStages={value => handleChange('stages', value)}
              officeStages={officeStages}
            />
          )}
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
          <NewProjectRateCalculator
            roles={roles}
            roleNumbers={roleNumbers}
            setRoleNumbers={setRoleNumbers}
            calculateAvgRate={calculateAvgRate}
            onCancel={() => setShowRateCalc(false)}
            onApply={rate => {
              handleChange('avgRate', rate);
              setShowRateCalc(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
