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
        
        const { data: projectStagesData, error: stagesError } = await supabase
          .from('project_stages')
          .select('stage_name, fee')
          .eq('project_id', project.id);
          
        if (stagesError) {
          console.error('Error fetching project stages:', stagesError);
          return;
        }

        console.log('Project stages data:', projectStagesData);
        
        const feesByStage: Record<string, number> = {};
        projectStagesData?.forEach(stage => {
          if (stage.stage_name && stage.fee) {
            feesByStage[stage.stage_name] = Number(stage.fee);
          }
        });
        
        console.log('Fees by stage name:', feesByStage);
        
        const feesByOfficeStageId: Record<string, number> = {};
        office_stages.forEach(officeStage => {
          const fee = feesByStage[officeStage.name];
          if (fee !== undefined) {
            feesByOfficeStageId[officeStage.id] = fee;
            console.log(`Mapped fee ${fee} for stage "${officeStage.name}" to office stage ID ${officeStage.id}`);
          }
        });
        
        console.log('Final mapped fees by office stage ID:', feesByOfficeStageId);
        setStageFees(feesByOfficeStageId);
        
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

    office_stages.forEach(stage => {
      const fee = getStageFee(stage.id);
      row[stage.id] = fee;
      console.log(`Setting fee for stage ${stage.name} (${stage.id}):`, fee);
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
