import { useState, useEffect } from 'react';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { mapStatusToDb, type ProjectStatus } from '../../utils/projectMappings';
import { getStatusColor } from '../../hooks/useProjectColors';
import { useProjectAreas } from '../../hooks/useProjectAreas';

export const useProjectTableRow = (project: any, refetch: () => void) => {
  const { locations } = useOfficeSettings();
  const { projectAreas, getAreaByCountry } = useProjectAreas();
  const [editableFields, setEditableFields] = useState<Record<string, any>>({});
  const [stageFees, setStageFees] = useState<Record<string, number>>({});

  useEffect(() => {
    setEditableFields({
      [project.id]: {
        name: project.name,
        code: project.code,
        profit: project.target_profit_percentage || 0,
        country: project.country,
        current_stage: project.current_stage
      }
    });
  }, [project]);

  useEffect(() => {
    const fetchStageFees = async () => {
      if (!project?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('project_fees')
          .select('stage_id, fee')
          .eq('project_id', project.id);
          
        if (error) {
          console.error('Error fetching stage fees:', error);
          return;
        }
        
        if (data) {
          const feeMap = data.reduce((acc, { stage_id, fee }) => {
            acc[stage_id] = fee;
            return acc;
          }, {} as Record<string, number>);
          
          setStageFees(feeMap);
        }
      } catch (err) {
        console.error('Error in fetchStageFees:', err);
      }
    };
    
    fetchStageFees();
  }, [project.id]);

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
        case 'current_stage':
          updateData.current_stage = value;
          
          // Also update the local state
          setEditableFields(prev => ({
            ...prev,
            [projectId]: {
              ...prev[projectId],
              current_stage: value
            }
          }));
          break;
        default:
          break;
      }
      
      if (Object.keys(updateData).length === 0) return;
      
      console.log(`Updating ${field} with:`, updateData);
      
      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);
        
      if (error) {
        console.error(`Error updating ${field}:`, error);
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
      console.log('Updating stage to:', newStage);
      
      // Update the editable fields state
      setEditableFields(prev => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          current_stage: newStage
        }
      }));
      
      const { error } = await supabase
        .from('projects')
        .update({ current_stage: newStage })
        .eq('id', projectId);
        
      if (error) {
        console.error('Database error:', error);
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

  const getStageFee = (projectId: string, stageId: string): number | null => {
    return stageFees[stageId] || null;
  };

  return {
    handleFieldUpdate,
    handleStatusChange,
    handleStageChange,
    getStatusColor,
    locations,
    editableFields,
    projectAreas,
    getAreaByCountry,
    getStageFee
  };
};
