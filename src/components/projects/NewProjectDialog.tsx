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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  stageFees: Record<string, {
    fee: string;
    billingMonth: string;
    status: "Not Billed" | "Invoiced" | "Paid" | "";
    invoiceDate: Date | null;
    hours: string;
    invoiceAge: number;
  }>;
};

export const NewProjectDialog: React.FC<{ onProjectCreated?: () => void }> = ({ onProjectCreated }) => {
  const [open, setOpen] = useState(false);
  const [showRateCalc, setShowRateCalc] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
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
    stageFees: {},
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
      if (!company || !company.id) {
        toast.error("No company context found, cannot load project resources.");
        return;
      }
      try {
        const { data: mgrs, error: mgrsError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role')
          .eq('role', 'member')
          .eq('company_id', company.id);
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
          .select('name')
          .eq('company_id', company.id);
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
          .select('id, city, country, code, emoji')
          .eq('company_id', company.id);
        if (locationsError) {
          console.error("Error fetching office locations:", locationsError);
          toast.error("Failed to load office options");
        } else {
          setOffices(Array.isArray(locations) ? locations : []);
        }

        const { data: projectStagesData, error: projectStagesError } = await supabase
          .from('project_stages')
          .select('id, stage_name')
          .eq('company_id', company.id);
        if (projectStagesError) {
          console.error("Error fetching project stages:", projectStagesError);
          toast.error("Failed to load project stage options");
        } else {
          setProjectStages(Array.isArray(projectStagesData) ? projectStagesData : []);
        }

        const { data: officeRoles, error: officeRolesError } = await supabase
          .from('office_roles')
          .select('id, name, code')
          .eq('company_id', company.id);
        if (officeRolesError) {
          console.error("Error fetching office roles:", officeRolesError);
          toast.error("Failed to load office roles");
        } else {
          setRoles(Array.isArray(officeRoles) ? officeRoles : []);
        }

        const { data: officeRates, error: officeRatesError } = await supabase
          .from('office_rates')
          .select('id, type, value, unit, reference_id')
          .eq('company_id', company.id);
        if (officeRatesError) {
          console.error("Error fetching office rates:", officeRatesError);
          toast.error("Failed to load office rates");
        } else {
          // Optional: for further use/display in dialog
        }

        const { data: officeHolidays, error: officeHolidaysError } = await supabase
          .from('office_holidays')
          .select('id, name, date')
          .eq('company_id', company.id);
        if (officeHolidaysError) {
          console.error("Error fetching office holidays:", officeHolidaysError);
          toast.error("Failed to load office holiday options");
        } else {
          // Optional: for further use/display in dialog
        }

        const { data: officeStagesData, error: officeStagesError } = await supabase
          .from('office_stages')
          .select('id, name')
          .eq('company_id', company.id);
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
  }, [open, company]);

  const handleChange = (key: keyof NewProjectForm, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
    
    // Initialize stage fees when stages are selected
    if (key === 'stages') {
      const newStageFees: Record<string, any> = {};
      
      // Create entries for all selected stages
      value.forEach((stageId: string) => {
        // Only create if it doesn't exist
        if (!form.stageFees[stageId]) {
          newStageFees[stageId] = {
            fee: '',
            billingMonth: '',
            status: 'Not Billed',
            invoiceDate: null,
            hours: '',
            invoiceAge: 0
          };
        } else {
          // Keep existing data
          newStageFees[stageId] = form.stageFees[stageId];
        }
      });
      
      setForm(prev => ({
        ...prev,
        stageFees: newStageFees
      }));
    }
  };

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

  const updateStageFee = (stageId: string, data: Partial<NewProjectForm['stageFees'][string]>) => {
    setForm(prev => ({
      ...prev,
      stageFees: {
        ...prev.stageFees,
        [stageId]: {
          ...prev.stageFees[stageId],
          ...data
        }
      }
    }));
  };

  const handleValidateTabs = () => {
    if (activeTab === "info") {
      if (!form.code || !form.name || !form.country || !form.profit || !form.status || !form.office || form.stages.length === 0) {
        toast.error('Please fill in all required fields in the Info tab.');
        return false;
      }
      return true;
    }
    
    if (activeTab === "stageFees") {
      // Check if any stage is missing fee
      for (const stageId of form.stages) {
        if (!form.stageFees[stageId]?.fee) {
          toast.error('Please specify fees for all stages.');
          return false;
        }
      }
      return true;
    }
    
    return true;
  };

  const handleTabChange = (newTab: string) => {
    if (handleValidateTabs()) {
      setActiveTab(newTab);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!handleValidateTabs()) {
      return;
    }
    
    if (!company || !company.id) {
      toast.error('No company found for your user. Cannot create project.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Create project
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
      
      if (error) throw error;
      
      const projectId = data[0].id;
      
      // Create stage fees
      const stageFeesPromises = form.stages.map(stageId => {
        const stageFee = form.stageFees[stageId];
        return supabase.from('project_stages').insert({
          project_id: projectId,
          company_id: company.id,
          stage_name: officeStages.find(s => s.id === stageId)?.name || 'Unknown Stage',
          fee: stageFee?.fee ? parseFloat(stageFee.fee) : 0
        });
      });
      
      await Promise.all(stageFeesPromises);
      
      setOpen(false);
      toast.success('Project successfully created!');
      setForm({
        code: "", name: "", manager: "", country: "", 
        profit: "", avgRate: "", status: "", office: "", stages: [],
        stageFees: {}
      });
      setActiveTab("info");
      
      if (typeof onProjectCreated === 'function') {
        onProjectCreated();
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { 
      if (!o) setActiveTab("info");
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
        
        <form onSubmit={onSubmit}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-4">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="info">Project Info</TabsTrigger>
              <TabsTrigger value="stageFees">Stage Fees</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info">
              <NewProjectStep1Info 
                form={form}
                managers={managers}
                countries={countries}
                offices={offices}
                officeStages={officeStages}
                statusOptions={statusOptions}
                onChange={handleChange}
              />
            </TabsContent>
            
            <TabsContent value="stageFees">
              <div className="space-y-6 py-4">
                {form.stages.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-muted-foreground">Please select project stages in the Info tab first.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Fee Structure</h3>
                      <p className="text-sm text-muted-foreground">
                        Define fees and billing information for each project stage
                      </p>
                    </div>
                    
                    {form.stages.map(stageId => {
                      const stageName = officeStages.find(stage => stage.id === stageId)?.name || 'Unknown Stage';
                      const stageFeeData = form.stageFees[stageId] || {
                        fee: '',
                        billingMonth: '',
                        status: 'Not Billed',
                        invoiceDate: null,
                        hours: '',
                        invoiceAge: 0
                      };
                      
                      // Calculate hours based on fee and average rate
                      const calculateHours = (fee: string): string => {
                        if (!fee || !form.avgRate || parseFloat(form.avgRate) === 0) return '';
                        
                        const feeValue = parseFloat(fee);
                        const rateValue = parseFloat(form.avgRate);
                        
                        if (isNaN(feeValue) || isNaN(rateValue) || rateValue === 0) return '';
                        
                        return (feeValue / rateValue).toFixed(2);
                      };
                      
                      // Calculate invoice age based on invoice date
                      const calculateInvoiceAge = (invoiceDate: Date | null): number => {
                        if (!invoiceDate) return 0;
                        
                        const today = new Date();
                        const diffTime = Math.abs(today.getTime() - invoiceDate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays;
                      };
                      
                      // Update calculated values
                      const hours = calculateHours(stageFeeData.fee);
                      const invoiceAge = calculateInvoiceAge(stageFeeData.invoiceDate);
                      
                      if (hours !== stageFeeData.hours) {
                        updateStageFee(stageId, { hours });
                      }
                      
                      if (invoiceAge !== stageFeeData.invoiceAge) {
                        updateStageFee(stageId, { invoiceAge });
                      }
                      
                      return (
                        <div key={stageId} className="border p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-4">{stageName}</h4>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label htmlFor={`fee-${stageId}`}>Fee</Label>
                              <input
                                id={`fee-${stageId}`}
                                type="number"
                                placeholder="0.00"
                                value={stageFeeData.fee}
                                onChange={(e) => updateStageFee(stageId, { fee: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`hours-${stageId}`}>Hours</Label>
                              <input
                                id={`hours-${stageId}`}
                                value={hours}
                                readOnly
                                disabled
                                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label htmlFor={`billingMonth-${stageId}`}>Billing Month</Label>
                              <input
                                id={`billingMonth-${stageId}`}
                                placeholder="e.g., April 2025"
                                value={stageFeeData.billingMonth}
                                onChange={(e) => updateStageFee(stageId, { billingMonth: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`status-${stageId}`}>Status</Label>
                              <select
                                id={`status-${stageId}`}
                                value={stageFeeData.status}
                                onChange={(e) => updateStageFee(stageId, { 
                                  status: e.target.value as "Not Billed" | "Invoiced" | "Paid" | "" 
                                })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="Not Billed">Not Billed</option>
                                <option value="Invoiced">Invoiced</option>
                                <option value="Paid">Paid</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Invoice Date</Label>
                              <input
                                type="date"
                                value={stageFeeData.invoiceDate ? new Date(stageFeeData.invoiceDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                  const date = e.target.value ? new Date(e.target.value) : null;
                                  updateStageFee(stageId, { 
                                    invoiceDate: date,
                                    invoiceAge: date ? calculateInvoiceAge(date) : 0
                                  });
                                }}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`invoiceAge-${stageId}`}>Invoice Age (Days)</Label>
                              <input
                                id={`invoiceAge-${stageId}`}
                                value={invoiceAge}
                                readOnly
                                disabled
                                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="resources">
              <div className="space-y-6 py-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">Project Resources</h3>
                  <p className="text-sm text-muted-foreground">
                    Allocate resources to the project
                  </p>
                </div>
                
                <div className="text-center py-8 border rounded-md bg-muted/10">
                  <p className="text-muted-foreground">Resource allocation will be available in a future update</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                if (activeTab === "info") return;
                if (activeTab === "stageFees") handleTabChange("info");
                if (activeTab === "resources") handleTabChange("stageFees");
              }}
              disabled={activeTab === "info"}
            >
              Previous
            </Button>
            
            {activeTab !== "resources" ? (
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  if (activeTab === "info") handleTabChange("stageFees");
                  if (activeTab === "stageFees") handleTabChange("resources");
                }}
              >
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
