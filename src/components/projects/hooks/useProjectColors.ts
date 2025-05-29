
import { useMemo } from 'react';
import { colors, getStatusColor as getCentralizedStatusColor } from '@/styles/colors';
import type { ProjectStatus } from '../utils/projectMappings';

type StatusColor = {
  bg: string;
  text: string;
};

export const getStatusColor = (status: ProjectStatus | string): StatusColor => {
  return getCentralizedStatusColor(status);
};

export const useStageColorMap = (office_stages: Array<{ name: string; color?: string }>) => {
  return useMemo(() => {
    const colorMap: Record<string, string> = {};
    
    office_stages.forEach(stage => {
      if (stage.name) {
        colorMap[stage.name] = stage.color || colors.defaults.stage;
      }
    });
    
    return colorMap;
  }, [office_stages]);
};
