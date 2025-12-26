import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export interface PlanningAuditEntry {
  id: string;
  project_id: string;
  project_name?: string;
  stage_name?: string;
  action_type: 'stage_added' | 'stage_removed' | 'contracted_weeks_updated' | 'team_composition_added' | 'team_composition_removed' | 'team_composition_updated';
  old_value?: string;
  new_value?: string;
  description: string;
  created_at: string;
  created_by: string;
  created_by_name?: string;
}

// Note: This uses local storage as a lightweight audit trail
// For production, you'd want a proper database table

const AUDIT_LOG_KEY = 'planning_audit_log';
const MAX_ENTRIES = 100;

export const usePlanningAuditLog = (projectId?: string) => {
  const { company } = useCompany();

  const getAuditLog = (): PlanningAuditEntry[] => {
    try {
      const stored = localStorage.getItem(AUDIT_LOG_KEY);
      if (!stored) return [];
      const entries = JSON.parse(stored) as PlanningAuditEntry[];
      
      // Filter by project if specified
      if (projectId) {
        return entries.filter(e => e.project_id === projectId);
      }
      
      // Filter by company (stored in entry)
      return entries.filter(e => true); // In production, filter by company
    } catch {
      return [];
    }
  };

  const addAuditEntry = (entry: Omit<PlanningAuditEntry, 'id' | 'created_at'>) => {
    try {
      const entries = getAuditLog();
      const newEntry: PlanningAuditEntry = {
        ...entry,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      };

      const updatedEntries = [newEntry, ...entries].slice(0, MAX_ENTRIES);
      localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(updatedEntries));

      return newEntry;
    } catch (error) {
      console.error('Error adding audit entry:', error);
      return null;
    }
  };

  const logContractedWeeksChange = (
    projectId: string,
    projectName: string,
    stageName: string,
    oldWeeks: number,
    newWeeks: number,
    userId: string,
    userName: string
  ) => {
    return addAuditEntry({
      project_id: projectId,
      project_name: projectName,
      stage_name: stageName,
      action_type: 'contracted_weeks_updated',
      old_value: oldWeeks.toString(),
      new_value: newWeeks.toString(),
      description: `Changed contracted weeks from ${oldWeeks} to ${newWeeks} for stage "${stageName}"`,
      created_by: userId,
      created_by_name: userName
    });
  };

  const logTeamCompositionChange = (
    projectId: string,
    projectName: string,
    stageName: string,
    actionType: 'team_composition_added' | 'team_composition_removed' | 'team_composition_updated',
    resourceName: string,
    details: string,
    userId: string,
    userName: string
  ) => {
    const actionVerb = actionType === 'team_composition_added' ? 'Added' :
                       actionType === 'team_composition_removed' ? 'Removed' : 'Updated';
    
    return addAuditEntry({
      project_id: projectId,
      project_name: projectName,
      stage_name: stageName,
      action_type: actionType,
      new_value: resourceName,
      description: `${actionVerb} ${resourceName} - ${details}`,
      created_by: userId,
      created_by_name: userName
    });
  };

  const logStageChange = (
    projectId: string,
    projectName: string,
    stageName: string,
    actionType: 'stage_added' | 'stage_removed',
    userId: string,
    userName: string
  ) => {
    const verb = actionType === 'stage_added' ? 'Added' : 'Removed';
    
    return addAuditEntry({
      project_id: projectId,
      project_name: projectName,
      stage_name: stageName,
      action_type: actionType,
      new_value: stageName,
      description: `${verb} stage "${stageName}"`,
      created_by: userId,
      created_by_name: userName
    });
  };

  return {
    auditLog: getAuditLog(),
    logContractedWeeksChange,
    logTeamCompositionChange,
    logStageChange
  };
};
