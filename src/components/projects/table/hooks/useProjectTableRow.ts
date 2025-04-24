
import { useState, useEffect } from 'react';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { mapStatusToDb, mapCustomStageToDB, type ProjectStatus } from '../../utils/projectMappings';
import { getStatusColor } from '../../hooks/useProjectColors';
import { useProjectAreas } from '../../hooks/useProjectAreas';

export const useProjectTableRow = (project: any, refetch: () => void) => {
  const { locations } = useOfficeSettings();
  const { projectAreas, getAreaByCountry } = useProjectAreas();
  const [editableFields, setEditableFields] = useState<Record<string, any>>({});

  useEffect(() => {
    setEditableFields({
      [project.id]: {
        name: project.name,
        code: project.code,
        profit: project.target_profit_percentage || 0,
        country: project.country
      }
    });
  }, [project]);

  const handleFieldUpdate = async (projectId: string, field: string, value: any) => {
    try {
      const updateData: Record<string, any> = {};
      
      switch(field) {
        case 'name':
          updateData.name = value;
          break;
        case 'code':
          updateData.code = value;
          break;
        case 'profit':
          updateData.target_profit_percentage = value;
          break;
        case 'country':
          updateData.country = value;
          break;
        default:
          break;
      }
      
      if (Object.keys(updateData).length === 0) return;
      
      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);
        
      if (error) {
        toast.error(`Failed to update ${field}`, { description: error.message });
      } else {
        toast.success(`${field} updated`);
        refetch();
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      toast.error(`An error occurred while updating ${field}`);
    }
  };

  const handleStatusChange = async (projectId: string, uiStatus: ProjectStatus) => {
    try {
      const dbStatus = mapStatusToDb(uiStatus);
      
      const { error } = await supabase
        .from('projects')
        .update({ status: dbStatus })
        .eq('id', projectId);
        
      if (error) {
        toast.error('Failed to update status', { description: error.message });
      } else {
        toast.success('Status updated');
        refetch();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('An error occurred while updating the status');
    }
  };

  const handleStageChange = async (projectId: string, newStage: string) => {
    try {
      // Map the stage name to the correct DB enum value
      const dbStage = mapCustomStageToDB(newStage);
      
      const { error } = await supabase
        .from('projects')
        .update({ current_stage: dbStage })
        .eq('id', projectId);
        
      if (error) {
        toast.error('Failed to update current stage', { description: error.message });
      } else {
        toast.success('Current stage updated');
        refetch();
      }
    } catch (err) {
      console.error('Error updating stage:', err);
      toast.error('An error occurred while updating the stage');
    }
  };

  return {
    handleFieldUpdate,
    handleStatusChange,
    handleStageChange,
    getStatusColor,
    locations,
    editableFields,
    projectAreas,
    getAreaByCountry
  };
};
