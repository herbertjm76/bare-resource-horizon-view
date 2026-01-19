
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Add a refetchSignal param (number or string), and reload if it changes.
export const useProjectStages = (projects: any[], office_stages: any[], refetchSignal: any = null) => {
  const [projectStages, setProjectStages] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Memoize project IDs to prevent unnecessary refetches
  const projectIds = useMemo(() => projects.map(p => p.id), [projects]);
  
  useEffect(() => {
    const fetchAllProjectStages = async () => {
      // If no projects or stages, don't load
      if (!projectIds.length || !office_stages.length) {
        setProjectStages({});
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Pre-build lookup maps for speed
      const stageIdByName = new Map<string, string>(
        office_stages.map((s: any) => [String(s.name), String(s.id)])
      );

      const CHUNK_SIZE = 200;
      const chunks: string[][] = [];
      for (let i = 0; i < projectIds.length; i += CHUNK_SIZE) {
        chunks.push(projectIds.slice(i, i + CHUNK_SIZE));
      }

      try {
        const chunkResults = await Promise.all(
          chunks.map(async (ids) => {
            const { data, error } = await supabase
              .from('project_stages')
              .select('project_id, stage_name, fee')
              .in('project_id', ids);

            if (error) throw error;
            return data || [];
          })
        );

        const projectStagesData = chunkResults.flat();

        // Pre-build the stages map for better performance
        const stagesMap: Record<string, Record<string, number>> = {};
        projectIds.forEach((projectId) => {
          stagesMap[projectId] = {};
        });

        for (const stageData of projectStagesData as any[]) {
          const fee = stageData?.fee;
          if (fee === null || fee === undefined || Number(fee) <= 0) continue;

          const officeStageId = stageIdByName.get(String(stageData.stage_name));
          if (!officeStageId) continue;

          stagesMap[String(stageData.project_id)][officeStageId] = Number(fee);
        }

        setProjectStages(stagesMap);
      } catch (err) {
        console.error('Error in fetchAllProjectStages:', err);
        setProjectStages({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProjectStages();
  }, [projectIds, office_stages, refetchSignal]); // refetch when this changes!

  const getProjectStageFee = (projectId: string, officeStageId: string): number | null => {
    const fee = projectStages[projectId]?.[officeStageId];
    return fee !== undefined ? fee : null;
  };

  return { projectStages, getProjectStageFee, isLoading };
};
