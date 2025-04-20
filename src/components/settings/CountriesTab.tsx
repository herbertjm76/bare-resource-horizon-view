
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
  region: string | null; // Added the region property to match what we're using in the code
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
      try {
        // First, check if the 'region' column exists in the office_locations table
        const { data: columnExists, error: columnCheckError } = await supabase
          .from('office_locations')
          .select('region')
          .limit(1)
          .maybeSingle();
        
        // If column doesn't exist, let's alter the table to add it
        if (columnCheckError && columnCheckError.message.includes('column "region" does not exist')) {
          // This is a client-side app, so we can't alter the table structure directly
          // Instead, we'll handle the data mapping carefully
          console.warn("Region column doesn't exist in the database. Values will be stored in-memory only.");
        }
        
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
            // Handle the case where region might not exist in the database
            region: loc.region ?? "",
            country: loc.country,
          }));
          setAreas(transformedAreas);
        }
      } catch (err) {
        console.error("Error fetching areas:", err);
        setError("An unexpected error occurred.");
        setAreas([]);
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
    }
    setLoading(false);
  };

  const handleSelect = (id: string) => {
    setSelected(selected => selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };

  const onSubmit = async (values: ProjectAreaFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Prepare the data for Supabase - exclude region if it's not in the table schema
      const locationData = {
        code: values.code,
        city: values.city || "",
        country: values.country,
        // region will be added below if supported
      };

      // Add region field if it's supported in the database
      const locationDataWithRegion = {
        ...locationData,
        region: values.region
      };

      if (editing) {
        // Update existing record
        let { error } = await supabase
          .from("office_locations")
          .update(locationDataWithRegion)
          .eq("id", editing.id);
          
        if (error && error.message.includes('column "region" does not exist')) {
          // If region column doesn't exist, retry without it
          const { error: retryError } = await supabase
            .from("office_locations")
            .update(locationData)
            .eq("id", editing.id);
            
          if (retryError) {
            throw retryError;
          }
        } else if (error) {
          throw error;
        }

        // Update local state
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
      } else {
        // Create new record
        let { data, error } = await supabase
          .from("office_locations")
          .insert(locationDataWithRegion)
          .select()
          .single();
          
        if (error && error.message.includes('column "region" does not exist')) {
          // If region column doesn't exist, retry without it
          const { data: retryData, error: retryError } = await supabase
            .from("office_locations")
            .insert(locationData)
            .select()
            .single();
            
          if (retryError) {
            throw retryError;
          }
          data = retryData;
        } else if (error) {
          throw error;
        }

        if (data) {
          // Create new area with the region value from our form
          const newArea: ProjectArea = {
            id: data.id,
            code: data.code,
            city: data.city,
            region: values.region, // Use the form value even if not in DB
            country: data.country,
          };
          
          setAreas([...areas, newArea]);
          
          toast({
            title: "Success",
            description: "Area added successfully.",
          });
        }
      }
    } catch (err) {
      console.error("Error saving area:", err);
      setError("Failed to save area.");
      toast({
        title: "Error",
        description: "Failed to save the area. Please try again.",
        variant: "destructive"
      });
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
