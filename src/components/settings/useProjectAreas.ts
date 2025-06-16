
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
      
      // Transform database data to match ProjectArea interface
      const transformedAreas = (data || []).map(item => ({
        id: item.id,
        code: item.code,
        country: item.name, // Map name to country for backward compatibility
        region: '', // Default empty region
        city: '', // Default empty city
        color: item.color || '#E5DEFF',
        company_id: item.company_id,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      setAreas(transformedAreas);
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
      // Transform ProjectArea data to database format
      const dbData = {
        code: areaData.code,
        name: areaData.country, // Map country back to name
        color: areaData.color,
        company_id: company.id
      };

      const { data, error } = await supabase
        .from('project_areas')
        .insert([dbData])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        // Transform back to ProjectArea format
        const newArea: ProjectArea = {
          id: data[0].id,
          code: data[0].code,
          country: data[0].name,
          region: '',
          city: '',
          color: data[0].color,
          company_id: data[0].company_id,
          created_at: data[0].created_at,
          updated_at: data[0].updated_at
        };
        
        setAreas(prev => [...prev, newArea]);
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
      // Transform ProjectArea data to database format
      const dbData: any = {};
      if (areaData.code) dbData.code = areaData.code;
      if (areaData.country) dbData.name = areaData.country;
      if (areaData.color) dbData.color = areaData.color;

      const { error } = await supabase
        .from('project_areas')
        .update(dbData)
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
    // Update local state immediately for smooth UI
    setAreas(newAreas);
    
    // Note: Since project_areas doesn't have an order_index column,
    // we'll just maintain the order in the UI. If you need persistent
    // ordering, you'll need to add an order_index column to the table.
    try {
      toast.success('Project areas reordered successfully');
    } catch (error) {
      console.error('Error reordering areas:', error);
      toast.error('Failed to reorder project areas');
      // Revert on error
      fetchAreas();
    }
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
