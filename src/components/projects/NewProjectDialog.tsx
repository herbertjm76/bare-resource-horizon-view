
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type RoleOption = { id: string; name: string };
type OfficeOption = { id: string; city: string; country: string; code?: string; emoji?: string };
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
  const [officeStages, setOfficeStages] = useState<OfficeStageOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch managers, country, offices, stages
  useEffect(() => {
    const fetchData = async () => {
      if (!company || !company.id) {
        toast.error("No company context found, cannot load project resources.");
        return;
      }
      try {
        const { data: mgrs } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role')
          .eq('role', 'member')
          .eq('company_id', company.id);

        setManagers(Array.isArray(mgrs)
          ? mgrs.map((u) => ({ id: u.id, name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() }))
          : []);

        const { data: projectAreas } = await supabase
          .from('project_areas')
          .select('name')
          .eq('company_id', company.id);

        const areaNames = Array.from(new Set(Array.isArray(projectAreas)
          ? projectAreas.map(a => a.name).filter(Boolean)
          : [])) as string[];
        setCountries(areaNames);

        const { data: locations } = await supabase
          .from('office_locations')
          .select('id, city, country, code, emoji')
          .eq('company_id', company.id);

        setOffices(Array.isArray(locations) ? locations : []);

        const { data: officeStagesData } = await supabase
          .from('office_stages')
          .select('id, name')
          .eq('company_id', company.id);

        setOfficeStages(Array.isArray(officeStagesData) ? officeStagesData : []);
      } catch (error) {
        toast.error("Failed to load project options");
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, company]);

  // --- FORM HANDLERS --- //

  const handleChange = (key: keyof NewProjectForm, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === 'stages') {
      // (Re)initialize stageFees for selected stages
      const newStageFees: Record<string, any> = {};
      value.forEach((stageId: string) => {
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
          newStageFees[stageId] = form.stageFees[stageId];
        }
      });
      setForm(prev => ({
        ...prev,
        stageFees: newStageFees
      }));
    }
  };

  // Set single stageFee fields, recalc hours/invoiceAge as needed
  const updateStageFee = (stageId: string, data: Partial<NewProjectForm['stageFees'][string]>) => {
    setForm(prev => {
      // recalc hours if fee or avgRate changes
      let hours = prev.stageFees[stageId]?.hours ?? '';
      const feeVal = data.fee ?? prev.stageFees[stageId]?.fee ?? '';
      const avgRateVal = prev.avgRate;
      if ((data.fee || data.fee === '') && avgRateVal && parseFloat(avgRateVal) > 0 && parseFloat(feeVal) > 0) {
        hours = (parseFloat(feeVal) / parseFloat(avgRateVal)).toFixed(2);
      } else if (!parseFloat(feeVal) || !parseFloat(avgRateVal)) {
        hours = '';
      }
      // recalc invoiceAge
      let invoiceAge = prev.stageFees[stageId]?.invoiceAge ?? 0;
      const invoiceDate = typeof data.invoiceDate !== "undefined" ? data.invoiceDate : prev.stageFees[stageId]?.invoiceDate;
      if (invoiceDate instanceof Date && !isNaN(invoiceDate.getTime())) {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - invoiceDate.getTime());
        invoiceAge = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        invoiceAge = 0;
      }
      return {
        ...prev,
        stageFees: {
          ...prev.stageFees,
          [stageId]: {
            ...prev.stageFees[stageId],
            ...data,
            hours,
            invoiceAge,
          }
        }
      };
    });
  };

  // --- TABS VALIDATION ---

  const isProjectInfoValid = () => {
    return (
      !!form.code &&
      !!form.name &&
      !!form.country &&
      !!form.profit &&
      !!form.status &&
      !!form.office
    );
  };

  const isStageFeesValid = () => {
    return form.stages.every((stageId) => {
      return !!form.stageFees[stageId]?.fee;
    });
  };

  const handleTabChange = (tab: string) => {
    // Only Project Info tab is required
    if (tab === "stageFees" && !isProjectInfoValid()) {
      toast.error("Please fill in all required fields in Project Info before proceeding.");
      return;
    }
    setActiveTab(tab);
  };

  // --- SUBMIT HANDLER ---

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProjectInfoValid()) {
      toast.error("Please complete all required fields.");
      setActiveTab("info");
      return;
    }
    if (!company || !company.id) {
      toast.error('No company context found.');
      return;
    }
    setIsLoading(true);
    try {
      // The status must always be a project_status type, never ""
      const projectStatus = form.status || "Planning";
      // Insert project
      const { data, error } = await supabase.from('projects').insert({
        code: form.code,
        name: form.name,
        company_id: company.id,
        project_manager_id: form.manager === "not_assigned" ? null : (form.manager || null),
        office_id: form.office,
        status: projectStatus,
        country: form.country,
        target_profit_percentage: form.profit ? Number(form.profit) : null
      }).select();

      if (error) throw error;
      const projectId = data?.[0]?.id;

      // Insert stage fees
      if (projectId && form.stages.length) {
        const stageFeesPromises = form.stages.map(stageId => {
          const feeObj = form.stageFees[stageId];
          return supabase.from('project_stages').insert({
            project_id: projectId,
            company_id: company.id,
            stage_name: officeStages.find(s => s.id === stageId)?.name ?? "Unknown Stage",
            fee: feeObj?.fee ? parseFloat(feeObj.fee) : 0
          });
        });
        await Promise.all(stageFeesPromises);
      }

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
      toast.error("Failed to create project: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI ---

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setActiveTab("info"); setOpen(o); }}>
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
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="info">Project Info</TabsTrigger>
              <TabsTrigger value="stageFees">Stage Fees</TabsTrigger>
              <TabsTrigger value="financial">Financial Info</TabsTrigger>
            </TabsList>

            {/* TAB 1: PROJECT INFO */}
            <TabsContent value="info">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Project Code *</Label>
                    <Input
                      id="code"
                      placeholder="P001"
                      value={form.code}
                      onChange={e => handleChange("code", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Project Name *</Label>
                    <Input
                      id="name"
                      placeholder="New Project"
                      value={form.name}
                      onChange={e => handleChange("name", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <select
                      id="country"
                      value={form.country}
                      onChange={e => handleChange("country", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select a country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="office">Office *</Label>
                    <select
                      id="office"
                      value={form.office}
                      onChange={e => handleChange("office", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select an office</option>
                      {offices.map(office => (
                        <option key={office.id} value={office.id}>
                          {office.emoji ? `${office.emoji} ` : ''}{office.city}, {office.country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manager">Project Manager</Label>
                    <select
                      id="manager"
                      value={form.manager}
                      onChange={e => handleChange("manager", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select a project manager</option>
                      <option value="not_assigned">Not Assigned</option>
                      {managers.map(mgr =>
                        <option key={mgr.id} value={mgr.id}>{mgr.name}</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <select
                      id="status"
                      value={form.status || ""}
                      onChange={e => handleChange("status", e.target.value as ProjectStatus)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select a status</option>
                      {statusOptions.map(opt =>
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profit">Target Profit % *</Label>
                    <Input
                      id="profit"
                      type="number"
                      min={0}
                      max={100}
                      value={form.profit}
                      placeholder="30"
                      onChange={e => handleChange("profit", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="avgRate">Average Rate (optional)</Label>
                    <Input
                      id="avgRate"
                      type="number"
                      min={0}
                      value={form.avgRate}
                      placeholder="50"
                      onChange={e => handleChange("avgRate", e.target.value)}
                    />
                  </div>
                </div>
                {/* Stages */}
                <div>
                  <Label>Project Stages</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {officeStages.map(stage => (
                      <label
                        key={stage.id}
                        className={`px-3 py-2 border rounded-md cursor-pointer transition-colors duration-200 ${
                          form.stages.includes(stage.id)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-input hover:bg-muted'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={form.stages.includes(stage.id)}
                          onChange={e => {
                            const updatedStages = e.target.checked
                              ? [...form.stages, stage.id]
                              : form.stages.filter(id => id !== stage.id);
                            handleChange("stages", updatedStages);
                          }}
                        />
                        {stage.name}
                      </label>
                    ))}
                  </div>
                  {officeStages.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      No stages defined. Please add stages in office settings.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: STAGE FEES */}
            <TabsContent value="stageFees">
              <div className="space-y-6 py-2">
                {form.stages.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-muted-foreground">Please select project stages in the Info tab first.</p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Stage Fees</h3>
                      <p className="text-sm text-muted-foreground">
                        Set fee and billing info for each stage.
                      </p>
                    </div>
                    {form.stages.map(stageId => {
                      const stage = officeStages.find(s => s.id === stageId);
                      const stageData = form.stageFees[stageId] || {
                        fee: '',
                        billingMonth: '',
                        status: 'Not Billed',
                        invoiceDate: null,
                        hours: '',
                        invoiceAge: 0
                      };
                      return (
                        <div key={stageId} className="border p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-3">{stage?.name ?? "Unknown Stage"}</h4>
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <Label htmlFor={`fee-${stageId}`}>Fee</Label>
                              <Input
                                id={`fee-${stageId}`}
                                type="number"
                                placeholder="0.00"
                                value={stageData.fee}
                                onChange={e => updateStageFee(stageId, { fee: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`hours-${stageId}`}>Hours (Fee/Rate)</Label>
                              <Input
                                id={`hours-${stageId}`}
                                value={stageData.hours || ""}
                                readOnly
                                disabled
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <Label htmlFor={`billingMonth-${stageId}`}>Billing Month</Label>
                              <Input
                                id={`billingMonth-${stageId}`}
                                value={stageData.billingMonth}
                                placeholder="e.g. April 2025"
                                onChange={e => updateStageFee(stageId, { billingMonth: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`status-${stageId}`}>Status</Label>
                              <select
                                id={`status-${stageId}`}
                                value={stageData.status}
                                onChange={e =>
                                  updateStageFee(stageId, { status: e.target.value as "Not Billed" | "Invoiced" | "Paid" | "" })
                                }
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              >
                                <option value="Not Billed">Not Billed</option>
                                <option value="Invoiced">Invoiced</option>
                                <option value="Paid">Paid</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`invoiceDate-${stageId}`}>Invoice Issued Date</Label>
                              <Input
                                id={`invoiceDate-${stageId}`}
                                type="date"
                                value={stageData.invoiceDate ? new Date(stageData.invoiceDate).toISOString().split('T')[0] : ''}
                                onChange={e => {
                                  const date = e.target.value ? new Date(e.target.value) : null;
                                  updateStageFee(stageId, { invoiceDate: date });
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`invoiceAge-${stageId}`}>Invoice Age (Days)</Label>
                              <Input
                                id={`invoiceAge-${stageId}`}
                                value={stageData.invoiceAge}
                                readOnly
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 3: FINANCIAL INFO */}
            <TabsContent value="financial">
              <div className="py-8 text-center text-muted-foreground">
                Financial project info coming soon.
              </div>
            </TabsContent>
          </Tabs>
          {/* Bottom buttons */}
          <div className="flex justify-end mt-8">
            <Button type="submit" variant="default" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
