
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CountriesToolbar from "./CountriesToolbar";
import useProjectAreas, { getAutoRegion } from "./useProjectAreas";
import { ProjectAreaFormValues, ProjectArea } from "./projectAreaTypes";
import ProjectAreaList from './ProjectAreaList';
import ProjectAreaForm from './ProjectAreaForm';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  country: z.string().min(1, "Country is required"),
  region: z.string().min(1, "Region is required"),
});

export const CountriesTab = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectArea | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
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
    defaultValues: { code: "", country: "", region: "" }
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
        const region = getAutoRegion(values.country);
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
    if (editing) {
      await updateArea(editing.id, values);
    } else {
      await addArea(values);
    }
    setOpen(false);
    form.reset();
    setEditing(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle>Project Areas</CardTitle>
        <CountriesToolbar editMode={editMode} setEditMode={setEditMode} setOpen={setOpen} />
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
