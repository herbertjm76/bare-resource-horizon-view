
import { useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { toast } from "@/hooks/use-toast";
import type { ProjectAreaFormValues, ProjectArea } from "./projectAreaTypes";
import { useProjectAreasState } from './hooks/useProjectAreasState';
import { 
  fetchProjectAreas, 
  createProjectArea, 
  updateProjectArea, 
  deleteProjectAreas 
} from './services/projectAreaService';

export { getAutoRegion } from './projectAreaUtils';

export default function useProjectAreas() {
  const { company, loading: companyLoading } = useCompany();
  const { 
    areas, 
    setAreas, 
    loading, 
    setLoading, 
    error, 
    setError 
  } = useProjectAreasState();

  useEffect(() => {
    if (companyLoading) return;
    setLoading(true);
    setError(null);

    const loadAreas = async () => {
      try {
        const loadedAreas = await fetchProjectAreas(company?.id);
        setAreas(loadedAreas);
      } catch (err) {
        setError("Failed to load project areas.");
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };

    loadAreas();
  }, [company, companyLoading, setAreas, setError, setLoading]);

  const addArea = async (values: ProjectAreaFormValues & { color?: string }) => {
    setLoading(true);
    setError(null);
    try {
      if (!company?.id) {
        throw new Error("No company selected; cannot save area.");
      }
      
      const newArea = await createProjectArea(company.id, values);
      setAreas(old => [...old, newArea]);
      toast.success("Area added successfully.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateArea = async (id: string, values: ProjectAreaFormValues & { color?: string }) => {
    setLoading(true);
    setError(null);
    try {
      if (!company?.id) {
        throw new Error("No company selected; cannot update area.");
      }

      await updateProjectArea(id, company.id, values);
      setAreas(areas =>
        areas.map(area =>
          area.id === id
            ? {
                ...area,
                code: values.code,
                country: values.country,
                region: values.region,
                company_id: company.id,
                color: values.color,
              }
            : area
        )
      );
      toast.success("Area updated successfully.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteAreas = async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProjectAreas(ids);
      setAreas(areas => areas.filter(a => !ids.includes(a.id)));
      toast.success(`${ids.length} area(s) deleted successfully.`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
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
