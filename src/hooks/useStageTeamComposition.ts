import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';

export interface TeamCompositionItem {
  id: string;
  referenceId: string;
  referenceName: string;
  referenceType: 'role' | 'member';
  memberType?: 'active' | 'pre_registered';
  roleName?: string; // Role name when referenceType is 'member'
  plannedQuantity: number;
  plannedHoursPerPerson: number;
  rateSnapshot: number;
  totalPlannedHours: number;
  totalBudgetAmount: number;
}

export interface CompositionInput {
  referenceId: string;
  referenceType: 'role' | 'member';
  plannedQuantity: number;
  plannedHoursPerPerson: number;
  rateSnapshot?: number;
}

export const useStageTeamComposition = (projectId: string, stageId: string) => {
  const queryClient = useQueryClient();
  const { company } = useCompany();

  const queryKey = ['stage-team-composition', projectId, stageId];

  // Fetch composition for the stage
  const { data: composition = [], isLoading, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!projectId || !stageId) return [];

      // Fetch composition items
      const { data, error } = await supabase
        .from('project_stage_team_composition')
        .select('*')
        .eq('project_id', projectId)
        .eq('stage_id', stageId);

      if (error) throw error;

      // Now fetch role and member names separately
      const roleIds = data?.filter(d => d.reference_type === 'role').map(d => d.reference_id) || [];
      const memberIds = data?.filter(d => d.reference_type === 'member').map(d => d.reference_id) || [];

      // Fetch all roles for lookup
      const { data: allRoles } = await supabase
        .from('office_roles')
        .select('id, name, code');
      
      const allRolesMap = Object.fromEntries((allRoles || []).map(r => [r.id, r]));

      // Fetch roles for role-type references
      let rolesMap: Record<string, string> = {};
      if (roleIds.length > 0) {
        roleIds.forEach(id => {
          const role = allRolesMap[id];
          if (role) {
            rolesMap[id] = `${role.name} (${role.code})`;
          }
        });
      }

      // Fetch active members from profiles
      let membersMap: Record<string, { name: string; type: 'active' | 'pre_registered'; roleId?: string }> = {};
      if (memberIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, office_role_id')
          .in('id', memberIds);
        
        profiles?.forEach(p => {
          const name = `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.email;
          membersMap[p.id] = { name, type: 'active', roleId: p.office_role_id || undefined };
        });

        // Also check invites for pre-registered members
        const { data: invites } = await supabase
          .from('invites')
          .select('id, first_name, last_name, email, office_role_id')
          .in('id', memberIds);
        
        invites?.forEach(i => {
          const name = `${i.first_name || ''} ${i.last_name || ''}`.trim() || i.email || 'Unknown';
          membersMap[i.id] = { name, type: 'pre_registered', roleId: i.office_role_id || undefined };
        });
      }

      const formattedData: TeamCompositionItem[] = (data || []).map(item => {
        let referenceName = 'Unknown';
        let memberType: 'active' | 'pre_registered' | undefined;
        let roleName: string | undefined;

        if (item.reference_type === 'role') {
          referenceName = rolesMap[item.reference_id] || 'Unknown Role';
        } else if (item.reference_type === 'member') {
          const memberInfo = membersMap[item.reference_id];
          referenceName = memberInfo?.name || 'Unknown Member';
          memberType = memberInfo?.type;
          // Get the role name for this member
          if (memberInfo?.roleId) {
            const role = allRolesMap[memberInfo.roleId];
            roleName = role ? `${role.name} (${role.code})` : undefined;
          }
        }

        return {
          id: item.id,
          referenceId: item.reference_id,
          referenceName,
          referenceType: item.reference_type as 'role' | 'member',
          memberType,
          roleName,
          plannedQuantity: item.planned_quantity,
          plannedHoursPerPerson: item.planned_hours_per_person,
          rateSnapshot: item.rate_snapshot,
          totalPlannedHours: item.total_planned_hours || (item.planned_quantity * item.planned_hours_per_person),
          totalBudgetAmount: item.total_budget_amount || 0
        };
      });

      return formattedData;
    },
    enabled: !!projectId && !!stageId,
  });

  // Save or update composition item
  const saveMutation = useMutation({
    mutationFn: async (input: CompositionInput) => {
      if (!company?.id || !projectId || !stageId) {
        throw new Error('Missing required data');
      }

      const totalPlannedHours = input.plannedQuantity * input.plannedHoursPerPerson;
      const rateSnapshot = input.rateSnapshot || 0;
      const totalBudgetAmount = totalPlannedHours * rateSnapshot;

      const { error } = await supabase
        .from('project_stage_team_composition')
        .upsert({
          project_id: projectId,
          stage_id: stageId,
          reference_id: input.referenceId,
          reference_type: input.referenceType,
          planned_quantity: input.plannedQuantity,
          planned_hours_per_person: input.plannedHoursPerPerson,
          rate_snapshot: rateSnapshot,
          total_planned_hours: totalPlannedHours,
          total_budget_amount: totalBudgetAmount,
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['project-stages', projectId] });
      toast.success('Resource added');
    },
    onError: (error) => {
      console.error('Error saving team composition:', error);
      toast.error('Failed to save resource');
    }
  });

  // Delete composition item
  const deleteMutation = useMutation({
    mutationFn: async (itemId: string) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['project-stages', projectId] });
      toast.success('Resource removed');
    },
    onError: (error) => {
      console.error('Error deleting team composition item:', error);
      toast.error('Failed to remove resource');
    }
  });

  // Calculate stage totals
  const stageTotals = {
    totalHours: composition.reduce((sum, item) => sum + item.totalPlannedHours, 0),
    totalBudget: composition.reduce((sum, item) => sum + item.totalBudgetAmount, 0),
    headcount: composition.length
  };

  return {
    composition,
    isLoading,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    stageTotals,
    saveItem: saveMutation.mutate,
    deleteItem: deleteMutation.mutate,
    refetch
  };
};
