
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Simulated DB
const mockStages = [
  { id: "1", name: "Concept Design", color: "#4f46e5", number: "1" },
  { id: "2", name: "Schematic Design", color: "#0ea5e9", number: "2" },
  { id: "3", name: "Design Development", color: "#10b981", number: "3" },
  { id: "4", name: "Construction Documents", color: "#f97316", number: "4" },
  { id: "5", name: "Construction Administration", color: "#8b5cf6", number: "5" }
];

const formSchema = z.object({
  name: z.string().min(1, "Stage name is required"),
  color: z.string().min(1, "Color is required"),
  number: z.string().min(1, "Stage number is required")
});

type StageFormValues = z.infer<typeof formSchema>;
type Stage = typeof mockStages[0];

export const StagesTab = () => {
  const [stages, setStages] = useState<Stage[]>(mockStages);
  const [open, setOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const form = useForm<StageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "#4f46e5",
      number: ""
    }
  });

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
      color: stage.color,
      number: stage.number
    });
    setOpen(true);
  };

  const handleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const handleBulkDelete = () => {
    setStages(stages.filter(stage => !selected.includes(stage.id)));
    setSelected([]);
    setEditMode(false);
  }

  const onSubmit = (values: StageFormValues) => {
    if (editingStage) {
      setStages(
        stages.map(stage => 
          stage.id === editingStage.id ? { ...stage, ...values } : stage
        )
      );
    } else {
      const newStage: Stage = { 
        id: Date.now().toString(), 
        name: values.name, 
        color: values.color,
        number: values.number
      };
      setStages([...stages, newStage]);
    }
    setOpen(false);
    form.reset();
    setEditingStage(null);
  };

  const colors = [
    "#4f46e5", "#0ea5e9", "#10b981", "#f97316", "#ec4899", 
    "#8b5cf6", "#d946ef", "#6366f1", "#0891b2", "#0d9488"
  ];

  const stageNumberOptions = [...Array(10).keys()].map(String).concat("NA");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Project Stages</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant={editMode ? "secondary" : "outline"} onClick={() => setEditMode(em => !em)}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Define the standard project stages for your office.
          </div>
          {editMode && (
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="destructive"
                size="sm"
                disabled={selected.length === 0}
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
              </Button>
              <span className="text-xs text-muted-foreground">{selected.length} selected</span>
            </div>
          )}
          {stages.length > 0 ? (
            <div className="grid gap-4">
              {stages.map((stage) => (
                <div 
                  key={stage.id}
                  className={`flex items-center justify-between p-3 border rounded-md ${editMode && "ring-2"} `}
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
          ) : (
            <div className="text-center p-4 border rounded-md border-dashed">
              No stages added yet. Click "Add Stage" to get started.
            </div>
          )}
        </div>
      </CardContent>

      {/* Add/Edit Dialog */}
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
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left font-normal"
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: field.value }}
                              />
                              <span>{field.value}</span>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                          <div className="grid grid-cols-5 gap-2">
                            {colors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                style={{ backgroundColor: color }}
                                onClick={() => form.setValue('color', color)}
                              />
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">{editingStage ? 'Update' : 'Add'} Stage</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
