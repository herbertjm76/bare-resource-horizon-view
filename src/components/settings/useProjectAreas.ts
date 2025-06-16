
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { ProjectArea } from './projectAreaTypes';
import { toast } from 'sonner';

export const useProjectAreas = () => {
  const [areas, setAreas] = useState<ProjectArea[]>([]);
  const [loading, setLoading] = useState(true);
  const { company } = useCompany();

  useEffect(() => {
    if (!company) {
      setLoading(false);
      return;
    }
    
    fetchAreas();
  }, [company]);

  const fetchAreas = async () => {
    if (!company) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_areas')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error('Error fetching project areas:', error);
      toast.error('Failed to load project areas');
    } finally {
      setLoading(false);
    }
  };

  const addArea = async (areaData: Omit<ProjectArea, 'id' | 'company_id'>) => {
    if (!company) return false;

    try {
      const { data, error } = await supabase
        .from('project_areas')
        .insert([{ ...areaData, company_id: company.id }])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setAreas(prev => [...prev, data[0]]);
        toast.success('Project area added successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding project area:', error);
      toast.error('Failed to add project area');
      return false;
    }
  };

  const updateArea = async (id: string, areaData: Partial<ProjectArea>) => {
    try {
      const { error } = await supabase
        .from('project_areas')
        .update(areaData)
        .eq('id', id);

      if (error) throw error;

      setAreas(prev => prev.map(area => 
        area.id === id ? { ...area, ...areaData } : area
      ));
      toast.success('Project area updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating project area:', error);
      toast.error('Failed to update project area');
      return false;
    }
  };

  const deleteArea = async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_areas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAreas(prev => prev.filter(area => area.id !== id));
      toast.success('Project area deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting project area:', error);
      toast.error('Failed to delete project area');
      return false;
    }
  };

  const reorderAreas = async (newAreas: ProjectArea[]) => {
    // Update local state immediately
    setAreas(newAreas);
    
    // Note: Since project_areas doesn't have an order_index column,
    // we'll just maintain the order in the UI. If you need persistent
    // ordering, you'll need to add an order_index column to the table.
  };

  return {
    areas,
    loading,
    addArea,
    updateArea,
    deleteArea,
    reorderAreas,
  };
};
