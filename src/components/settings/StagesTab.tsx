import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Check, Palette } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';

const formSchema = z.object({
  name: z.string().min(1, "Stage name is required"),
  color: z.string().min(1, "Color is required"),
  number: z.string().min(1, "Stage number is required")
});

type StageFormValues = z.infer<typeof formSchema> & {
  id?: string
};

type Stage = {
  id: string;
  name: string;
  color?: string;
  number?: string;
  order_index: number;
  company_id?: string;
};

const COLORS = [
  // Blue family
  "#E6F2FF", "#93C5FD", 
  // Green family
  "#E6F4F1", "#6EE7B7", 
  // Yellow family
  "#FEF3C7", "#FCD34D", 
  // Orange family
  "#FFEDD5", "#FEB041", 
  // Pink family
  "#FFE4E6", "#FB7185", 
  // Purple family
  "#E5E1FF", "#A78BFA"
];

const stageNumberOptions = [...Array(10).keys()].map(n => String(n + 1)).concat("NA");

export const StagesTab = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [open, setOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { company } = useCompany();

  const form = useForm<StageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: COLORS[0],
      number: ""
    }
  });

  const fetchStages = async () => {
    setLoading(true);
    if (!company || !company.id) {
      setStages([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("office_stages")
      .select("*")
      .eq("company_id", company.id)
      .order("order_index", { ascending: true });

    if (error) {
      toast.error("Failed to load stages", { description: error.message });
      setStages([]);
      setLoading(false);
      return;
    }

    const mappedStages = Array.isArray(data) ? data.map((s, idx) => ({
      ...s,
      color: s.color || COLORS[(s.order_index - 1) % COLORS.length] || "#4f46e5",
      number: s.number || String(s.order_index),
      company_id: s.company_id || company.id,
    })) : [];
    setStages(mappedStages);
    setLoading(false);
  };

  useEffect(() => {
    if (company) fetchStages();
    else setStages([]);
  }, [company]);

  const persistLocalStageDetails = (id: string, color: string, number: string) => {
    let data: Record<string, { color: string; number: string }> = {};
    try {
      data = JSON.parse(localStorage.getItem("office_stage_details") || "{}");
    } catch {/**/}
    data[id] = { color, number };
    localStorage.setItem("office_stage_details", JSON.stringify(data));
  };

  const removeLocalStageDetails = (ids: string[]) => {
    let data: Record<string, { color: string; number: string }> = {};
    try {
      data = JSON.parse(localStorage.getItem("office_stage_details") || "{}");
      ids.forEach(id => { delete data[id]; });
      localStorage.setItem("office_stage_details", JSON.stringify(data));
    } catch {/**/}
  };

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditingStage(null);
    }
  };

  const handleEdit = (stage: Stage) => {
    setEditingStage(stage);
    form.reset({
      name: stage.name,
      color: stage.color || COLORS[0],
      number: stage.number || "",
      id: stage.id
    });
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (!company || !company.id) {
      toast.error("Error", { description: "No company found in context" });
      return;
    }
    
    setLoading(true);
    const { error } = await supabase
      .from("office_stages")
      .delete()
      .in("id", selected)
      .eq("company_id", company.id);
      
    if (error) {
      toast.error("Failed to delete stages", { description: error.message });
      setLoading(false);
      return;
    }
    
    removeLocalStageDetails(selected);
    setStages(stages => stages.filter(stage => !selected.includes(stage.id)));
    setSelected([]);
    setEditMode(false);
    setLoading(false);
    toast.success("Stages deleted", { description: "Selected stages have been deleted." });
  };

  const onSubmit = async (values: StageFormValues) => {
    if (!company || !company.id) {
      toast.error("Error", { description: "No company found in context" });
      return;
    }
    setLoading(true);

    try {
      if (editingStage) {
        const { error } = await supabase
          .from("office_stages")
          .update({
            name: values.name,
            color: values.color,
            company_id: company.id,
          })
          .eq("id", editingStage.id)
          .eq("company_id", company.id);

        if (error) throw error;
        toast.success("Stage updated");
      } else {
        const maxOrder = stages.length ? Math.max(...stages.map(s => s.order_index)) : 0;
        const { data, error } = await supabase
          .from("office_stages")
          .insert({
            name: values.name,
            order_index: maxOrder + 1,
            color: values.color,
            company_id: company.id,
          })
          .select()
          .single();

        if (error || !data) throw error || new Error("No data returned from insertion");
        toast.success("Stage added");
      }
      setOpen(false);
      form.reset();
      setEditingStage(null);
      await fetchStages();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Project Stages</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant={editMode ? "secondary" : "outline"} onClick={() => setEditMode(em => !em)} disabled={loading}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button size="sm" onClick={() => setOpen(true)} disabled={loading || !company}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Define the standard project stages for your office. These are used across ALL PROJECTS.
          </div>
          
          {!company && (
            <div className="text-center p-4 border rounded-md border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
              No company selected. Please select a company to manage project stages.
            </div>
          )}
          
          {editMode && company && (
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="destructive"
                size="sm"
                disabled={selected.length === 0 || loading}
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
              </Button>
              <span className="text-xs text-muted-foreground">{selected.length} selected</span>
            </div>
          )}
          
          {loading ? (
            <div className="text-center p-4 border rounded-md border-dashed">Loading...</div>
          ) : company && stages.length > 0 ? (
            <div className="grid gap-4">
              {stages.map((stage) => (
                <div 
                  key={stage.id}
                  className={`flex items-center justify-between p-3 border rounded-md ${editMode ? "ring-2" : ""} `}
                  style={editMode && selected.includes(stage.id) ? { borderColor: "#dc2626", background: "#fee2e2" } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className="font-medium">{stage.name}</span>
                    <span className="text-xs bg-muted-foreground/10 rounded px-2">{stage.number}</span>
                  </div>
                  {editMode ? (
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-purple-600"
                      checked={selected.includes(stage.id)}
                      onChange={() => handleSelect(stage.id)}
                    />
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(stage)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : company ? (
            <div className="text-center p-4 border rounded-md border-dashed">
              No stages added yet. Click "Add Stage" to get started.
            </div>
          ) : null}
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingStage ? 'Edit' : 'Add'} Project Stage</DialogTitle>
            <DialogDescription>
              Enter the details for this project stage.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Concept Design" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage Number</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full border rounded p-2">
                        <option value="">Select stage number...</option>
                        {stageNumberOptions.map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Color
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-6 gap-2 my-2">
                        {COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-full h-8 rounded-md flex items-center justify-center transition 
                              ${field.value === color ? 'ring-2 ring-primary border-primary' : 'border border-input'}
                              hover:scale-105 focus:outline-none`}
                            style={{ backgroundColor: color }}
                            onClick={() => field.onChange(color)}
                            aria-label={color}
                          >
                            {field.value === color && (
                              <Check className="w-4 h-4 text-black drop-shadow" />
                            )}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {editingStage ? 'Update' : 'Add'} Stage
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
