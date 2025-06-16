
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProjectAreaForm from './ProjectAreaForm';
import ProjectAreaList from './ProjectAreaList';
import { useProjectAreas } from './useProjectAreas';
import { ProjectArea } from './projectAreaTypes';
import { toast } from 'sonner';

const projectAreaFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  country: z.string().min(1, "Country is required"),
  region: z.string().optional(),
  city: z.string().optional(),
  color: z.string().min(1, "Color is required"),
});

export type ProjectAreaFormValues = z.infer<typeof projectAreaFormSchema>;

export const CountriesTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState<ProjectArea | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { areas, loading, addArea, updateArea, deleteArea } = useProjectAreas();

  const form = useForm<ProjectAreaFormValues>({
    resolver: zodResolver(projectAreaFormSchema),
    defaultValues: {
      code: "",
      country: "",
      region: "",
      city: "",
      color: "#E5DEFF",
    },
  });

  const handleSubmit = async (values: ProjectAreaFormValues) => {
    try {
      setIsSubmitting(true);
      let success = false;
      
      // Convert form values to match the expected API format
      const areaData = {
        code: values.code,
        country: values.country,
        region: values.region || "",
        city: values.city || "",
        color: values.color,
      };
      
      if (editingArea) {
        success = await updateArea(editingArea.id, areaData);
      } else {
        success = await addArea(areaData);
      }

      if (success) {
        setShowForm(false);
        setEditingArea(null);
        form.reset();
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('An error occurred while saving the project area');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (area: ProjectArea) => {
    setEditingArea(area);
    form.reset({
      code: area.code,
      country: area.country,
      region: area.region || "",
      city: area.city || "",
      color: area.color || "#E5DEFF",
    });
    setShowForm(true);
  };

  const handleDelete = async (area: ProjectArea) => {
    if (window.confirm('Are you sure you want to delete this project area?')) {
      await deleteArea(area.id);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setShowForm(open);
    if (!open) {
      setEditingArea(null);
      form.reset();
    }
  };

  const handleAddNew = () => {
    setEditingArea(null);
    form.reset({
      code: "",
      country: "",
      region: "",
      city: "",
      color: "#E5DEFF",
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading project areas...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Project Areas</CardTitle>
        <Button 
          size="sm" 
          onClick={handleAddNew}
          disabled={showForm}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Area
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Manage project areas or countries where your company operates. These can be used to categorize and organize your projects.
          </div>
          
          <ProjectAreaForm
            open={showForm}
            loading={isSubmitting}
            editing={editingArea}
            form={form}
            onSubmit={handleSubmit}
            onOpenChange={handleOpenChange}
          />
          
          <ProjectAreaList
            areas={areas}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
};
