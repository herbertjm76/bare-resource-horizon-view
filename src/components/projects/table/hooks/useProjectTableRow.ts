import { useState, useEffect } from 'react';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { mapStatusToDb, type ProjectStatus } from '../../utils/projectMappings';
import { getStatusColor } from '../../hooks/useProjectColors';
import { useProjectAreas } from '../../hooks/useProjectAreas';

export const useProjectTableRow = (project: any, refetch: () => void) => {
  const { locations, office_stages } = useOfficeSettings();
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
        console.log('Fetching stage fees for project:', project.id);
        
        const stageNameToIdMap: Record<string, string> = {};
        
        if (office_stages && office_stages.length > 0) {
          office_stages.forEach(stage => {
            stageNameToIdMap[stage.name] = stage.id;
          });
        }
        
        console.log('Stage name to ID mapping:', stageNameToIdMap);
        
        const { data, error } = await supabase
          .from('project_fees')
          .select('stage_id, fee')
          .eq('project_id', project.id);
          
        if (error) {
          console.error('Error fetching stage fees:', error);
          return;
        }
        
        if (data) {
          console.log('Stage fees data received:', data);
          
          const feesByOfficeStageId: Record<string, number> = {};
          
          for (const feeRecord of data) {
            try {
              const { data: stageData } = await supabase
                .from('office_stages')
                .select('name')
                .eq('id', feeRecord.stage_id)
                .single();
                
              if (stageData && stageData.name) {
                const stageName = stageData.name;
                const officeStageId = stageNameToIdMap[stageName];
                
                if (officeStageId) {
                  feesByOfficeStageId[officeStageId] = Number(feeRecord.fee);
                  console.log(`Mapped fee ${feeRecord.fee} for stage "${stageName}" to office stage ID ${officeStageId}`);
                } else {
                  console.log(`Could not find an office stage with name "${stageName}"`);
                }
              }
            } catch (stageError) {
              console.error('Error getting stage name:', stageError);
            }
          }
          
          console.log('Processed stage fees map by office stage ID:', feesByOfficeStageId);
          setStageFees(feesByOfficeStageId);
        }
      } catch (err) {
        console.error('Error in fetchStageFees:', err);
      }
    };
    
    fetchStageFees();
  }, [project.id, office_stages]);

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

  const getStageFee = (officeStageId: string): number | null => {
    console.log('Getting fee for office stage:', officeStageId, 'Current fees:', stageFees);
    const fee = stageFees[officeStageId];
    return fee !== undefined ? fee : null;
  };

  const buildProjectRow = () => {
    const row: Record<string, any> = {
      id: project.id,
      code: project.code,
      name: project.name,
      project_manager: project.project_manager,
      status: project.status,
      country: project.country,
      target_profit_percentage: project.target_profit_percentage,
      current_stage: project.current_stage,
    };

    Object.keys(stageFees).forEach(stageId => {
      row[stageId] = stageFees[stageId];
    });

    console.log('Built project row with fees:', row);
    return row;
  };

  return {
    handleFieldUpdate,
    handleStatusChange,
    handleStageChange,
    getStatusColor,
    locations,
    editableFields,
    getAreaByCountry,
    getStageFee,
    buildProjectRow
  };
};
