
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
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

// Sample data - in a real app this would come from the database
const mockStages = [
  { id: "1", name: "Concept Design", color: "#4f46e5" },
  { id: "2", name: "Schematic Design", color: "#0ea5e9" },
  { id: "3", name: "Design Development", color: "#10b981" },
  { id: "4", name: "Construction Documents", color: "#f97316" },
  { id: "5", name: "Construction Administration", color: "#8b5cf6" }
];

const formSchema = z.object({
  name: z.string().min(1, "Stage name is required"),
  color: z.string().min(1, "Color is required"),
});

type StageFormValues = z.infer<typeof formSchema>;
type Stage = typeof mockStages[0];

export const StagesTab = () => {
  const [stages, setStages] = useState(mockStages);
  const [open, setOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);

  const form = useForm<StageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "#4f46e5"
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
      color: stage.color
    });
    setOpen(true);
  };

  const onSubmit = (values: StageFormValues) => {
    if (editingStage) {
      // Update existing stage
      setStages(stages.map(stage => 
        stage.id === editingStage.id ? { ...stage, ...values } : stage
      ));
    } else {
      // Add new stage with proper typing
      const newStage: Stage = { 
        id: Date.now().toString(), 
        name: values.name, 
        color: values.color 
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Project Stages</CardTitle>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Stage
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Define the standard project stages for your office.
          </div>
          
          {stages.length > 0 ? (
            <div className="grid gap-4">
              {stages.map((stage) => (
                <div 
                  key={stage.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-medium">{stage.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(stage)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
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
