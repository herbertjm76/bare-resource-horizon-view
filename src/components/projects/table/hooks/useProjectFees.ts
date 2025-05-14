
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { OfficeStage } from '../types';

export const useProjectFees = (projectId: string, office_stages: OfficeStage[]) => {
  const [stageFees, setStageFees] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchStageFees = async () => {
      if (!projectId) return;
      
      try {
        console.log('Fetching stage fees for project:', projectId);
        
        const { data: projectStagesData, error: stagesError } = await supabase
          .from('project_stages')
          .select('stage_name, fee')
          .eq('project_id', projectId);
          
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
        
        const feesByOfficeStageId: Record<string, number> = {};
        office_stages.forEach(officeStage => {
          const fee = feesByStage[officeStage.name];
          if (fee !== undefined) {
            feesByOfficeStageId[officeStage.id] = fee;
          }
        });
        
        console.log('Final mapped fees by office stage ID:', feesByOfficeStageId);
        setStageFees(feesByOfficeStageId);
        
      } catch (err) {
        console.error('Error in fetchStageFees:', err);
      }
    };
    
    fetchStageFees();
  }, [projectId, office_stages]);

  const getStageFee = (officeStageId: string): number | null => {
    const fee = stageFees[officeStageId];
    return fee !== undefined ? fee : null;
  };

  return { stageFees, getStageFee };
};
