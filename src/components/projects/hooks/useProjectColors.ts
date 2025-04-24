
import { useMemo } from 'react';
import type { ProjectStatus } from '../utils/projectMappings';

type StatusColor = {
  bg: string;
  text: string;
};

export const getStatusColor = (status: ProjectStatus | string): StatusColor => {
  switch (status) {
    case 'In Progress':
      return { bg: '#E2F8F0', text: '#0D9488' };
    case 'Not Started':
      return { bg: '#E5DEFF', text: '#6E59A5' };
    case 'Completed':
      return { bg: '#E0F2FE', text: '#0EA5E9' };
    case 'On Hold':
      return { bg: '#FEF3C7', text: '#D97706' };
    case 'Planning':
      return { bg: '#E5DEFF', text: '#6E59A5' };
    default:
      return { bg: '#F3F4F6', text: '#6B7280' };
  }
};

export const useStageColorMap = (office_stages: Array<{ name: string; color?: string }>) => {
  return useMemo(() => {
    const colorMap: Record<string, string> = {};
    
    office_stages.forEach(stage => {
      if (stage.name) {
        colorMap[stage.name] = stage.color || '#E5DEFF';
      }
    });
    
    return colorMap;
  }, [office_stages]);
};
