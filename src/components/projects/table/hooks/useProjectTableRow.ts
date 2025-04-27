
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { useProjectAreas } from '../../hooks/useProjectAreas';
import { getStatusColor } from '../../hooks/useProjectColors';
import { useProjectFees } from './useProjectFees';
import { useProjectFields } from './useProjectFields';
import { useProjectStatus } from './useProjectStatus';
import type { Project } from '../types';

export const useProjectTableRow = (project: Project, refetch: () => void) => {
  const { locations, office_stages } = useOfficeSettings();
  const { projectAreas, getAreaByCountry } = useProjectAreas();
  const { stageFees, getStageFee } = useProjectFees(project.id, office_stages);
  const { editableFields, handleFieldUpdate } = useProjectFields(project, refetch);
  const { handleStatusChange, handleStageChange } = useProjectStatus(refetch);

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
    });

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
