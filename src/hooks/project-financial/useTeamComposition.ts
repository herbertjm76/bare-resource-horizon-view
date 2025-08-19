import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';

export interface TeamCompositionItem {
  id?: string;
  referenceId: string;
  referenceName: string;
  referenceType: 'role' | 'location';
  plannedQuantity: number;
  plannedHoursPerPerson: number;
  rateSnapshot: number;
  totalPlannedHours: number;
  totalBudgetAmount: number;
}

export const useTeamComposition = (projectId: string, stageId: string) => {
  const [composition, setComposition] = useState<TeamCompositionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { company } = useCompany();

  const fetchComposition = useCallback(async () => {
    if (!projectId || !stageId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_stage_team_composition')
        .select(`
          *,
          office_roles:reference_id!inner(name, code),
          office_locations:reference_id!inner(city, country, code)
        `)
        .eq('project_id', projectId)
        .eq('stage_id', stageId);

      if (error) throw error;

      const formattedData: TeamCompositionItem[] = data?.map(item => ({
        id: item.id,
        referenceId: item.reference_id,
        referenceName: item.reference_type === 'role' 
          ? (item as any).office_roles?.name || 'Unknown Role'
          : `${(item as any).office_locations?.city}, ${(item as any).office_locations?.country}` || 'Unknown Location',
        referenceType: item.reference_type as 'role' | 'location',
        plannedQuantity: item.planned_quantity,
        plannedHoursPerPerson: item.planned_hours_per_person,
        rateSnapshot: item.rate_snapshot,
        totalPlannedHours: item.total_planned_hours,
        totalBudgetAmount: item.total_budget_amount
      })) || [];

      setComposition(formattedData);
    } catch (error) {
      console.error('Error fetching team composition:', error);
      toast.error('Failed to load team composition');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, stageId]);

  const saveCompositionItem = useCallback(async (item: Omit<TeamCompositionItem, 'id' | 'totalPlannedHours' | 'totalBudgetAmount'>) => {
    if (!company?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('project_stage_team_composition')
        .upsert({
          project_id: projectId,
          stage_id: stageId,
          reference_id: item.referenceId,
          reference_type: item.referenceType,
          planned_quantity: item.plannedQuantity,
          planned_hours_per_person: item.plannedHoursPerPerson,
          rate_snapshot: item.rateSnapshot,
          company_id: company.id
        }, {
          onConflict: 'project_id,stage_id,reference_id,reference_type'
        });

      if (error) throw error;

      // Update stage budgets
      await supabase.rpc('update_stage_budgets', {
        p_project_id: projectId,
        p_stage_id: stageId
      });

      await fetchComposition();
      toast.success('Team composition updated');
    } catch (error) {
      console.error('Error saving team composition:', error);
      toast.error('Failed to save team composition');
    } finally {
      setIsSaving(false);
    }
  }, [projectId, stageId, company?.id, fetchComposition]);

  const deleteCompositionItem = useCallback(async (itemId: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('project_stage_team_composition')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      // Update stage budgets
      await supabase.rpc('update_stage_budgets', {
        p_project_id: projectId,
        p_stage_id: stageId
      });

      await fetchComposition();
      toast.success('Team composition item removed');
    } catch (error) {
      console.error('Error deleting team composition item:', error);
      toast.error('Failed to remove team composition item');
    } finally {
      setIsSaving(false);
    }
  }, [projectId, stageId, fetchComposition]);

  return {
    composition,
    isLoading,
    isSaving,
    fetchComposition,
    saveCompositionItem,
    deleteCompositionItem
  };
};