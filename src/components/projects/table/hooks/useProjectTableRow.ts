
import { useState, useEffect } from 'react';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { useProjectAreas } from '../../hooks/useProjectAreas';
import { getStatusColor } from '../../hooks/useProjectColors';
import { useProjectFields } from './useProjectFields';
import { useProjectStatus } from './useProjectStatus';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import type { Project } from '../types';

export const useProjectTableRow = (project: Project, refetch: () => void) => {
  const { company } = useCompany();
  const { locations, departments } = useOfficeSettings();
  const { projectAreas, getAreaByCountry } = useProjectAreas();
  const { editableFields, handleFieldUpdate, updateEditableField, flushPendingUpdates, isFieldSaving, isSaving } = useProjectFields(project, refetch);
  const { handleStatusChange, handleStageChange } = useProjectStatus(refetch);
  const [managers, setManagers] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchManagers = async () => {
      if (!company?.id) return;
      
      const { data: mgrs } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('company_id', company.id);

      setManagers(Array.isArray(mgrs)
        ? mgrs.map(u => ({ 
            id: u.id, 
            name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() 
          }))
        : []);
    };

    fetchManagers();
  }, [company?.id]);

  return {
    handleFieldUpdate,
    handleStatusChange,
    handleStageChange,
    getStatusColor,
    locations,
    departments,
    editableFields,
    getAreaByCountry,
    updateEditableField,
    flushPendingUpdates,
    managers,
    projectAreas,
    isFieldSaving,
    isSaving
  };
};
