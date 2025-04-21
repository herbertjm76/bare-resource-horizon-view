
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CountriesToolbar from "./CountriesToolbar";
import useProjectAreas, { getAutoRegion } from "./useProjectAreas";
import { ProjectAreaFormValues, ProjectArea } from "./projectAreaTypes";
import ProjectAreaList from './ProjectAreaList';
import ProjectAreaForm from './ProjectAreaForm';
import { useCompany } from '@/context/CompanyContext';
import { AlertCircle } from 'lucide-react';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  country: z.string().min(1, "Country is required"),
  region: z.string().min(1, "Region is required"),
  city: z.string().optional(),
});

export const CountriesTab = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectArea | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const { company, loading: companyLoading } = useCompany();
  
  const {
    areas,
    loading,
    error,
    addArea,
    updateArea,
    deleteAreas,
  } = useProjectAreas();

  const form = useForm<ProjectAreaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "", country: "", region: "", city: "" }
  });

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
      region: area.region ?? getAutoRegion(area.country),
      country: area.country,
      city: area.city,
    });
    setOpen(true);
  };

  const handleBulkDelete = async () => {
    await deleteAreas(selected);
    setSelected([]);
    setEditMode(false);
  };

  const handleSelect = (id: string) => {
    setSelected(selected => selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };

  React.useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === "country") {
        const region = getAutoRegion(values.country || "");
        if (region) {
          form.setValue("region", region, { shouldValidate: true });
        }
      }
    });
    return () => {
      subscription.unsubscribe?.();
    };
  }, [form]);

  const onSubmit = async (values: ProjectAreaFormValues) => {
    if (!company) {
      return; // Prevent submission if no company
    }
    
    if (editing) {
      await updateArea(editing.id, values);
    } else {
      await addArea(values);
    }
    setOpen(false);
    form.reset();
    setEditing(null);
  };

  // Show company warning if needed
  const showCompanyWarning = !company && !companyLoading;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Project Areas</CardTitle>
        <CountriesToolbar 
          editMode={editMode} 
          setEditMode={setEditMode} 
          setOpen={setOpen} 
          disabled={!company}
        />
      </CardHeader>
      <CardContent>
        {showCompanyWarning && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>No company selected; cannot save area. Please ensure you're logged in with a company account.</span>
          </div>
        )}
        
        <ProjectAreaList
          areas={areas}
          loading={loading || companyLoading}
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
