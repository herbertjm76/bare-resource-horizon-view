
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProjectAreaList, { ProjectArea } from './ProjectAreaList';
import ProjectAreaForm, { ProjectAreaFormValues } from './ProjectAreaForm';
import { countryRegions } from './projectAreaHelpers';

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  region: z.string().min(1, "Region is required"),
});

type DatabaseLocation = {
  id: string;
  code: string;
  city: string | null;
  country: string;
  created_at: string;
  emoji: string | null;
  updated_at: string;
  region: string | null;
};

export const CountriesTab = () => {
  const [areas, setAreas] = useState<ProjectArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectArea | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<ProjectAreaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "", country: "", city: "", region: "" }
  });

  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("office_locations")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        setError("Failed to load project areas.");
        setAreas([]);
      } else {
        const transformedAreas = (data as DatabaseLocation[] || []).map(loc => ({
          id: loc.id,
          code: loc.code,
          city: loc.city ?? "",
          region: loc.region ?? "",
          country: loc.country,
        }));
        setAreas(transformedAreas);
      }
      setLoading(false);
    };
    fetchAreas();
  }, []);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
      setEditing(null);
    }
  };

  const handleEdit = (area: ProjectArea) => {
    setEditing(area);
    form.reset({
      code: area.code,
      city: area.city ?? "",
      region: area.region ?? "",
      country: area.country,
    });
    setOpen(true);
  };

  const handleBulkDelete = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from("office_locations")
      .delete()
      .in("id", selected);
    if (error) {
      setError("Failed to delete area(s).");
      toast({
        title: "Error",
        description: "Failed to delete the selected area(s).",
        variant: "destructive"
      });
    } else {
      setAreas(areas.filter(a => !selected.includes(a.id)));
      toast({
        title: "Success",
        description: `${selected.length} area(s) deleted successfully.`,
      });
      setSelected([]);
      setEditMode(false);
      setLoading(false);
    }
  };

  const handleSelect = (id: string) => {
    setSelected(selected => selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };

  const onSubmit = async (values: ProjectAreaFormValues) => {
    setLoading(true);
    setError(null);

    if (editing) {
      const { error } = await supabase
        .from("office_locations")
        .update({
          code: values.code,
          city: values.city || "",
          country: values.country,
          region: values.region
        })
        .eq("id", editing.id);
      if (error) {
        setError("Failed to update area.");
        toast({
          title: "Error",
          description: "Failed to update the area. Please try again.",
          variant: "destructive"
        });
      } else {
        setAreas(
          areas.map(area => area.id === editing.id
            ? { ...area, ...values }
            : area
          )
        );
        toast({
          title: "Success",
          description: "Area updated successfully.",
        });
      }
    } else {
      const { data, error } = await supabase
        .from("office_locations")
        .insert({
          code: values.code,
          city: values.city || "",
          country: values.country,
          region: values.region
        })
        .select()
        .single();

      if (error) {
        setError("Failed to add area.");
        toast({
          title: "Error",
          description: "Failed to add the area. Please try again.",
          variant: "destructive"
        });
        console.error("Error adding area:", error);
      } else if (data) {
        const newArea: ProjectArea = {
          id: data.id,
          code: data.code,
          city: data.city,
          region: data.region || "",
          country: data.country,
        };
        setAreas([...areas, newArea]);
        toast({
          title: "Success",
          description: "Area added successfully.",
        });
      }
    }
    setOpen(false);
    form.reset();
    setEditing(null);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Project Areas</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant={editMode ? "secondary" : "outline"} onClick={() => setEditMode(em => !em)}>
            <Edit className="h-4 w-4 mr-2" /> {editMode ? "Done" : "Edit"}
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Area
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ProjectAreaList
          areas={areas}
          loading={loading}
          error={error}
          editMode={editMode}
          selected={selected}
          onEdit={handleEdit}
          onSelect={handleSelect}
          onBulkDelete={handleBulkDelete}
        />
      </CardContent>
      <ProjectAreaForm
        open={open}
        loading={loading}
        editing={editing}
        form={form}
        onSubmit={onSubmit}
        onOpenChange={onOpenChange}
      />
    </Card>
  );
};

export default CountriesTab;
