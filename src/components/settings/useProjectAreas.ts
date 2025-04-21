
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import allCountries from "@/lib/allCountries.json";
import { getContinentByCountryCode } from './projectAreaHelpers';

// Updated type to match the office_areas table structure
export type DatabaseArea = {
  id: string;
  code: string;
  name: string;
  created_at: string;
  emoji: string | null;
  updated_at: string;
};

export type ProjectArea = {
  id: string;
  code: string;
  city?: string;
  region: string;
  country: string;
};

export type ProjectAreaFormValues = {
  code: string;
  country: string;
  city?: string;
  region: string;
};

function getAutoRegion(country: string): string {
  const countryData = allCountries.find((c) => c.name === country);
  if (countryData) {
    return getContinentByCountryCode(countryData.code);
  }
  return "";
}

export default function useProjectAreas() {
  const [areas, setAreas] = useState<ProjectArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchAreas = async () => {
      try {
        const { data, error } = await supabase
          .from("office_areas")
          .select("*")
          .order("created_at", { ascending: true });
          
        if (error) {
          console.error("Supabase error:", error);
          setError("Failed to load project areas.");
          setAreas([]);
        } else {
          // Use the correct type for the data from office_areas table
          const transformedAreas = (data as DatabaseArea[] || []).map(area => ({
            id: area.id,
            code: area.code,
            city: "", // office_areas doesn't have city, so we default to empty string
            region: getAutoRegion(area.name),
            country: area.name, // The country name is stored in the 'name' field
          }));
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
  }, []);

  // Add
  const addArea = async (values: ProjectAreaFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const areaData: any = {
        code: values.code,
        name: values.country,
        emoji: null
      };
      
      const { data, error } = await supabase
        .from("office_areas")
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
        const newArea: ProjectArea = {
          id: data.id,
          code: data.code,
          region: getAutoRegion(data.name),
          country: data.name,
        };
        setAreas(old => [...old, newArea]);
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

  // Update
  const updateArea = async (id: string, values: ProjectAreaFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const areaData: any = {
        code: values.code,
        name: values.country,
      };
      
      const { error } = await supabase
        .from("office_areas")
        .update(areaData)
        .eq("id", id);

      if (error) {
        setError("Failed to save area.");
        toast({
          title: "Error",
          description: error?.message || "Failed to save the area. Please try again.",
          variant: "destructive"
        });
      } else {
        setAreas(areas => areas.map(area => area.id === id
          ? { ...area, ...values, region: getAutoRegion(values.country) }
          : area
        ));
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

  // Bulk Delete
  const deleteAreas = async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("office_areas")
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

export { getAutoRegion };
