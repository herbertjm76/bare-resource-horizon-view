import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCompany } from '@/context/CompanyContext';

import type {
  ProjectAreaFormValues,
  ProjectArea,
  ProjectAreaRow,
} from "./projectAreaTypes";
import { getAutoRegion, toProjectArea } from './projectAreaUtils';
import { getPastelColor } from './projectAreaHelpers';

export { getAutoRegion };

export default function useProjectAreas() {
  const [areas, setAreas] = useState<ProjectArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { company, loading: companyLoading } = useCompany();

  useEffect(() => {
    if (companyLoading) return;
    setLoading(true);
    setError(null);

    const fetchAreas = async () => {
      if (!company || !company.id) {
        setAreas([]);
        setLoading(false);
        setError("No company selected; cannot load areas.");
        return;
      }
      const { data, error } = await supabase
        .from("project_areas")
        .select("*")
        .eq('company_id', company.id)
        .order("created_at", { ascending: true });

      if (error) {
        setError("Failed to load project areas.");
        setAreas([]);
      } else {
        const transformedAreas = Array.isArray(data)
          ? data.map(area => toProjectArea({
              ...area,
              color: area.color || "#E5DEFF",
            }))
          : [];
        setAreas(transformedAreas);
      }
      setLoading(false);
    };

    fetchAreas();
  }, [company, companyLoading]);

  const addArea = async (values: ProjectAreaFormValues & { color?: string }) => {
    setLoading(true);
    setError(null);
    try {
      if (!company || !company.id) {
        setError("No company selected; cannot save area.");
        toast({
          title: "Error",
          description: "No company selected; cannot save area.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const areaColor = values.color || getPastelColor(values.code);
      
      const areaData = {
        code: values.code,
        name: values.country,
        emoji: null,
        company_id: company.id,
        color: areaColor
      };

      const { data, error } = await supabase
        .from("project_areas")
        .insert(areaData)
        .select()
        .single();

      if (error) {
        setError("Failed to save area.");
        toast({ title: "Error", description: error?.message, variant: "destructive" });
      }
      if (data) {
        setAreas(old => [...old, toProjectArea({
          ...data,
          color: data.color || areaColor
        })]);
        toast({ title: "Success", description: "Area added successfully." });
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateArea = async (id: string, values: ProjectAreaFormValues & { color?: string }) => {
    setLoading(true);
    setError(null);
    try {
      if (!company || !company.id) {
        setError("No company selected; cannot update area.");
        toast({ title: "Error", description: "No company selected; cannot update area.", variant: "destructive" });
        setLoading(false);
        return;
      }
      
      const areaColor = values.color || getPastelColor(values.code);
      
      const areaData = {
        code: values.code,
        name: values.country,
        company_id: company.id,
        color: areaColor
      };

      const { error } = await supabase
        .from("project_areas")
        .update(areaData)
        .eq("id", id);

      if (error) {
        setError("Failed to update area.");
        toast({ title: "Error", description: error?.message, variant: "destructive" });
      } else {
        setAreas(areas =>
          areas.map(area =>
            area.id === id
              ? {
                  ...area,
                  code: values.code,
                  country: values.country,
                  region: values.region,
                  company_id: company.id,
                  color: areaColor,
                }
              : area
          )
        );
        toast({ title: "Success", description: "Area updated successfully." });
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteAreas = async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("project_areas")
        .delete()
        .in("id", ids);

      if (error) {
        console.error("Error deleting areas:", error);
        setError("Failed to delete area(s).");
        toast({
          title: "Error",
          description: "Failed to delete the selected area(s).",
          variant: "destructive"
        });
      } else {
        setAreas(areas => areas.filter(a => !ids.includes(a.id)));
        toast({
          title: "Success",
          description: `${ids.length} area(s) deleted successfully.`,
        });
      }
    } catch (err) {
      console.error("Error deleting areas:", err);
      setError("An unexpected error occurred.");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    areas, 
    setAreas,
    loading, 
    setLoading,
    error, 
    setError,
    addArea,
    updateArea,
    deleteAreas,
  };
}
