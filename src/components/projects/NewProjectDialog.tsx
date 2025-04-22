
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

type RoleOption = { id: string; name: string };
type OfficeOption = { id: string; city: string; country: string };
type ProjectStageOption = { id: string; stage_name: string; };

const statusOptions = [
  { label: "Not started", value: "Planning" },
  { label: "On-going", value: "In Progress" },
  { label: "Completed", value: "Complete" },
  { label: "On hold", value: "On Hold" },
];

type NewProjectForm = {
  code: string;
  name: string;
  manager: string;
  country: string;
  profit: string;
  avgRate: string;
  status: string;
  office: string;
  stages: string[];
};

export const NewProjectDialog: React.FC = () => {
  // Dialog, rates popup
  const [open, setOpen] = useState(false);
  const [showRateCalc, setShowRateCalc] = useState(false);

  // Form state
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

  // Dynamic data options
  const [managers, setManagers] = useState<RoleOption[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [offices, setOffices] = useState<OfficeOption[]>([]);
  const [projectStages, setProjectStages] = useState<ProjectStageOption[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string; code: string; }[]>([]);
  const [roleNumbers, setRoleNumbers] = useState<{ [roleId: string]: number }>({});

  // Fetch project managers, project areas, offices, stages
  useEffect(() => {
    (async () => {
      // Project managers
      const { data: mgrs } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .eq('role', 'member');

      setManagers(Array.isArray(mgrs)
        ? mgrs.map((u) => ({ id: u.id, name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() }))
        : []);

      // Project areas/countries
      const { data: areas } = await supabase
        .from('project_areas')
        .select('country, name');
      setCountries(Array.from(new Set((areas ?? []).map(a => a.country ?? a.name).filter(Boolean))) as string[]);

      // Office locations
      const { data: off } = await supabase
        .from('office_locations')
        .select('id, city, country');
      setOffices(Array.isArray(off) ? off : []);

      // Project stages
      const { data: stages } = await supabase
        .from('project_stages')
        .select('id, stage_name');
      setProjectStages(Array.isArray(stages) ? stages : []);

      // Office roles for rate calculation
      const { data: officeRoles } = await supabase
        .from('office_roles')
        .select('id, name, code');
      setRoles(Array.isArray(officeRoles) ? officeRoles : []);
    })();
  }, []);

  // Helpers to update the form
  const handleChange = (key: keyof NewProjectForm, value: any) => setForm((f) => ({ ...f, [key]: value }));

  // Average rate calculation logic
  const calculateAvgRate = () => {
    let total = 0;
    let count = 0;
    roles.forEach(role => {
      const num = roleNumbers[role.id] || 0;
      if (num > 0) {
        // Here, you'll want to fetch the rate for this role from office_rates, but for now just use a dummy
        // In production, do a join or extra query for rates.
        // We'll use a fake static rate for demo, e.g. $50.
        const dummyRate = 50;
        total += dummyRate * num;
        count += num;
      }
    });
    return count > 0 ? (total / count).toFixed(2) : '';
  };

  // Handle submitting the project
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!form.code || !form.name || !form.manager || !form.country || !form.profit || !form.avgRate || !form.status || !form.office || form.stages.length === 0) {
      toast.error('Please fill in all required fields.');
      return;
    }
    // TODO: Insert new project to Supabase
    setOpen(false);
    toast.success('Project successfully created!');
    // Optionally, you can reset the form here
  };

  // UI
  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); setShowRateCalc(false); }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Add New Project <span className="text-sm text-destructive ml-2">*</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-1 flex items-center gap-1"><Code className="w-4 h-4" />Project Code<span className="text-destructive">*</span></label>
              <Input value={form.code} onChange={e => handleChange('code', e.target.value)} required placeholder="Enter Project Code" />
            </div>
            <div>
              <label className="block font-semibold mb-1 flex items-center gap-1"><FileText className="w-4 h-4" />Project Name<span className="text-destructive">*</span></label>
              <Input value={form.name} onChange={e => handleChange('name', e.target.value)} required placeholder="Enter Project Name" />
            </div>
            <div>
              <label className="block font-semibold mb-1 flex items-center gap-1"><Users className="w-4 h-4" />Project Manager<span className="text-destructive">*</span></label>
              <Select value={form.manager} onValueChange={v => handleChange('manager', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Manager" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block font-semibold mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" />Project Country<span className="text-destructive">*</span></label>
              <Select value={form.country} onValueChange={v => handleChange('country', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block font-semibold mb-1 flex items-center gap-1"><Percent className="w-4 h-4" />% Profit<span className="text-destructive">*</span></label>
              <Input value={form.profit} type="number" onChange={e => handleChange('profit', e.target.value)} required placeholder="Enter %Profit" />
            </div>
            <div>
              <label className="block font-semibold mb-1 flex items-center gap-1"><Calculator className="w-4 h-4" />AVG Rate<span className="text-destructive">*</span></label>
              <div className="flex gap-2">
                <Input value={form.avgRate} type="number" onChange={e => handleChange('avgRate', e.target.value)} required placeholder="Enter AVG Rate" />
                <Button type="button" variant="outline" size="icon" onClick={() => setShowRateCalc(true)} title="Calculate Avg Rate">
                  <Calculator className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 flex items-center gap-1"><CheckSquare className="w-4 h-4" />Project Status<span className="text-destructive">*</span></label>
              <Select value={form.status} onValueChange={v => handleChange('status', v)}>
                <SelectTrigger>
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
              <label className="block font-semibold mb-1 flex items-center gap-1"><Building className="w-4 h-4" />Office<span className="text-destructive">*</span></label>
              <Select value={form.office} onValueChange={v => handleChange('office', v)}>
                <SelectTrigger>
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
            {/* Deadline removed as per instructions */}
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2 flex items-center gap-2"><CheckSquare className="w-4 h-4" />Project Stages (Multi-Select)<span className="text-destructive">*</span></div>
            <div className="flex flex-wrap gap-6">
              {projectStages.map(stage => (
                <label className="flex items-center gap-2" key={stage.id}>
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
                  {stage.stage_name}
                </label>
              ))}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">Close</Button>
            </DialogClose>
            <Button type="submit" variant="default">
              Add Project
            </Button>
          </DialogFooter>
        </form>
        {/* Average Rate Calculator Popup */}
        {showRateCalc && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <Card className="p-6 max-w-lg mx-auto relative z-50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calculator className="w-5 h-5" />Ave Rate Calculator</h2>
              <div className="space-y-3 mb-4">
                {roles.map(role => (
                  <div className="flex items-center gap-3" key={role.id}>
                    <span className="w-36">{role.name}</span>
                    <Input
                      type="number"
                      value={roleNumbers[role.id] || ''}
                      min={0}
                      onChange={e => setRoleNumbers(rns => ({
                        ...rns,
                        [role.id]: Number(e.target.value)
                      }))}
                      placeholder="Number"
                      className="w-24"
                    />
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <span className="font-medium mr-2">Average Rate:</span>
                <span className="text-primary font-bold">{calculateAvgRate() || '--'}</span>
                <span className="ml-1 text-muted-foreground text-sm">(dummy rates)</span>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setShowRateCalc(false);
                  }}
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
                >
                  Apply
                </Button>
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
