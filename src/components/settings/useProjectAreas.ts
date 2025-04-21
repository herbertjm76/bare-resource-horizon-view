
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import allCountries from "@/lib/allCountries.json";
import { getContinentByCountryCode } from './projectAreaHelpers';

// Types that match the office_locations table in Supabase
export type LocationRow = {
  id: string;
  city: string;
  country: string;
  code: string;
  emoji: string | null;
  created_at: string;
  updated_at: string;
};

// The ProjectArea shape as used in the app
export type ProjectArea = {
  id: string;
  code: string;
  city?: string;
  region: string;
  country: string;
};

// Used on form submit
export type ProjectAreaFormValues = {
  code: string;
  country: string;
  city?: string;
  region: string;
};

// Helper: given a country name, find the region
function getAutoRegion(country: string): string {
  const countryData = allCountries.find((c) => c.name === country);
  if (countryData) {
    return getContinentByCountryCode(countryData.code);
  }
  return "";
}

// Helper: convert from DB row to ProjectArea
function toProjectArea(location: LocationRow): ProjectArea {
  return {
    id: location.id,
    code: location.code,
    city: location.city,
    region: getAutoRegion(location.country),
    country: location.country,
  };
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
          .from("office_locations")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          setError("Failed to load project areas.");
          setAreas([]);
        } else {
          // Transform using map
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
  }, []);

  // Add
  const addArea = async (values: ProjectAreaFormValues) => {
    setLoading(true);
    setError(null);
    try {
      // Match the structure of the office_locations table
      const locationData = {
        code: values.code,
        country: values.country,
        city: values.city || "",
        emoji: null,
      };

      const { data, error } = await supabase
        .from("office_locations")
        .insert(locationData)
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
        setAreas(old => [...old, toProjectArea(data as LocationRow)]);
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
      const locationData = {
        code: values.code,
        country: values.country,
        city: values.city || "",
      };

      const { error } = await supabase
        .from("office_locations")
        .update(locationData)
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
                  city: values.city || ""
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

  // Bulk Delete
  const deleteAreas = async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from("office_locations")
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
