
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

// Note: exports getAutoRegion for legacy/compatibility
export { getAutoRegion };

export default function useProjectAreas() {
  const [areas, setAreas] = useState<ProjectArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { company } = useCompany();

  // Fetch Project Areas from project_areas table
  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchAreas = async () => {
      try {
        if (!company) {
          setAreas([]);
          setLoading(false);
          return;
        }
        
        console.log("Fetching project areas for company:", company.id);
        
        const { data, error } = await supabase
          .from("project_areas")
          .select("*")
          .eq('company_id', company.id)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          setError("Failed to load project areas.");
          setAreas([]);
        } else {
          console.log("Project areas data:", data);
          const transformedAreas = Array.isArray(data)
            ? data.map(toProjectArea)
            : [];
          setAreas(transformedAreas);
        }
      } catch (err) {
        console.error("Error fetching project areas:", err);
        setError("An unexpected error occurred.");
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
    // eslint-disable-next-line
  }, [company]);

  // Add Project Area (project_areas)
  const addArea = async (values: ProjectAreaFormValues) => {
    setLoading(true);
    setError(null);
    try {
      if (!company) {
        setError("No company selected; cannot save area.");
        toast({
          title: "Error",
          description: "No company selected; cannot save area.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      const areaData = {
        code: values.code,
        name: values.country,
        emoji: null,
        company_id: company.id,
      };
      const { data, error } = await supabase
        .from("project_areas")
        .insert(areaData)
        .select()
        .single();

      if (error) {
        setError("Failed to save area.");
        toast({
          title: "Error",
          description: error?.message || "Failed to save the area. Please try again.",
          variant: "destructive"
        });
      }
      if (data) {
        setAreas(old => [...old, toProjectArea(data as ProjectAreaRow)]);
        toast({
          title: "Success",
          description: "Area added successfully.",
        });
      }
    } catch (err) {
      console.error("Error adding area:", err);
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

  // Update Project Area
  const updateArea = async (id: string, values: ProjectAreaFormValues) => {
    setLoading(true);
    setError(null);
    try {
      if (!company) {
        setError("No company selected; cannot update area.");
        toast({
          title: "Error",
          description: "No company selected; cannot update area.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      const areaData = {
        code: values.code,
        name: values.country,
        company_id: company.id,
      };

      const { error } = await supabase
        .from("project_areas")
        .update(areaData)
        .eq("id", id);

      if (error) {
        setError("Failed to update area.");
        toast({
          title: "Error",
          description: error?.message || "Failed to update the area. Please try again.",
          variant: "destructive"
        });
      } else {
        setAreas(areas =>
          areas.map(area =>
            area.id === id
              ? {
                  ...area,
                  code: values.code,
                  country: values.country,
                  region: getAutoRegion(values.country),
                  company_id: company.id,
                }
              : area
          )
        );
        toast({
          title: "Success",
          description: "Area updated successfully.",
        });
      }
    } catch (err) {
      console.error("Error updating area:", err);
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

  // Bulk Delete Project Areas
  const deleteAreas = async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("project_areas")
        .delete()
        .in("id", ids);

      if (error) {
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
    areas, setAreas,
    loading, setLoading,
    error, setError,
    addArea,
    updateArea,
    deleteAreas,
  };
}
