
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectArea } from './projectAreaTypes';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

export const useProjectAreas = () => {
  const [areas, setAreas] = useState<ProjectArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { company } = useCompany();

  const fetchAreas = async () => {
    if (!company?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching project areas for company:', company.id);
      
      const { data, error: fetchError } = await supabase
        .from('project_areas')
        .select('*')
        .eq('company_id', company.id)
        .order('name');

      if (fetchError) {
        console.error('Error fetching project areas:', fetchError);
        setError('Failed to load project areas');
        toast.error('Failed to load project areas');
        return;
      }

      console.log('Project areas fetched:', data);
      
      // Transform database data to match ProjectArea interface
      const transformedAreas: ProjectArea[] = (data || []).map(area => ({
        id: area.id,
        code: area.code,
        country: area.name, // Use 'name' from DB as 'country' in interface
        region: '', // Default empty region since DB doesn't have this field
        city: '', // Default empty city since DB doesn't have this field
        color: area.color || '#E5DEFF',
        company_id: area.company_id
      }));
      
      setAreas(transformedAreas);
    } catch (err) {
      console.error('Unexpected error fetching project areas:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addArea = async (area: Omit<ProjectArea, 'id' | 'created_at' | 'updated_at'>) => {
    if (!company?.id) {
      toast.error('No company found');
      return false;
    }

    try {
      console.log('Adding project area:', area);
      
      // Transform ProjectArea data to match database schema
      const dbData = {
        code: area.code,
        name: area.country, // Use 'country' from interface as 'name' in DB
        color: area.color || '#E5DEFF',
        company_id: company.id,
        emoji: null
      };
      
      const { data, error: insertError } = await supabase
        .from('project_areas')
        .insert([dbData])
        .select()
        .single();

      if (insertError) {
        console.error('Error adding project area:', insertError);
        toast.error(`Failed to add project area: ${insertError.message}`);
        return false;
      }

      console.log('Project area added successfully:', data);
      toast.success('Project area added successfully');
      await fetchAreas(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Unexpected error adding project area:', err);
      toast.error('An unexpected error occurred while adding the project area');
      return false;
    }
  };

  const updateArea = async (id: string, updates: Partial<ProjectArea>) => {
    if (!company?.id) {
      toast.error('No company found');
      return false;
    }

    try {
      console.log('Updating project area:', id, updates);
      
      // Transform ProjectArea data to match database schema
      const dbUpdates: any = {};
      if (updates.code) dbUpdates.code = updates.code;
      if (updates.country) dbUpdates.name = updates.country; // Use 'country' from interface as 'name' in DB
      if (updates.color) dbUpdates.color = updates.color;
      
      const { error: updateError } = await supabase
        .from('project_areas')
        .update(dbUpdates)
        .eq('id', id)
        .eq('company_id', company.id);

      if (updateError) {
        console.error('Error updating project area:', updateError);
        toast.error(`Failed to update project area: ${updateError.message}`);
        return false;
      }

      console.log('Project area updated successfully');
      toast.success('Project area updated successfully');
      await fetchAreas(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Unexpected error updating project area:', err);
      toast.error('An unexpected error occurred while updating the project area');
      return false;
    }
  };

  const deleteArea = async (id: string) => {
    if (!company?.id) {
      toast.error('No company found');
      return false;
    }

    try {
      console.log('Deleting project area:', id);
      
      const { error: deleteError } = await supabase
        .from('project_areas')
        .delete()
        .eq('id', id)
        .eq('company_id', company.id);

      if (deleteError) {
        console.error('Error deleting project area:', deleteError);
        toast.error(`Failed to delete project area: ${deleteError.message}`);
        return false;
      }

      console.log('Project area deleted successfully');
      toast.success('Project area deleted successfully');
      await fetchAreas(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Unexpected error deleting project area:', err);
      toast.error('An unexpected error occurred while deleting the project area');
      return false;
    }
  };

  useEffect(() => {
    fetchAreas();
  }, [company?.id]);

  return {
    areas,
    loading,
    error,
    addArea,
    updateArea,
    deleteArea,
    refetch: fetchAreas
  };
};
