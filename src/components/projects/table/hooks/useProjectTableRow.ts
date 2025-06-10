
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { useProjectAreas } from '../../hooks/useProjectAreas';
import { getStatusColor } from '../../hooks/useProjectColors';
import { useProjectFields } from './useProjectFields';
import { useProjectStatus } from './useProjectStatus';
import type { Project } from '../types';

export const useProjectTableRow = (project: Project, refetch: () => void) => {
  const { locations } = useOfficeSettings();
  const { projectAreas, getAreaByCountry } = useProjectAreas();
  const { editableFields, handleFieldUpdate } = useProjectFields(project, refetch);
  const { handleStatusChange, handleStageChange } = useProjectStatus(refetch);

  return {
    handleFieldUpdate,
    handleStatusChange,
    handleStageChange,
    getStatusColor,
    locations,
    editableFields,
    getAreaByCountry
  };
};
