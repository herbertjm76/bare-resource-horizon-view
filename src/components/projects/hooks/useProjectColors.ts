
export const useStageColorMap = (stages: { id: string; color?: string; name: string }[]) => {
  const map: Record<string, string> = {};
  stages.forEach(stage => {
    map[stage.name] = stage.color || '#E5DEFF';
    map[stage.id] = stage.color || '#E5DEFF';
  });
  return map;
};

export const useAreaColorMap = (areas: { code: string; color?: string; country: string }[]) => {
  const map: Record<string, string> = {};
  areas.forEach(area => {
    map[area.country] = area.color || '#E5DEFF';
    map[area.code] = area.color || '#E5DEFF';
  });
  return map;
};

export const getStatusColor = (status: string) => {
  switch(status) {
    case 'On Hold':
      return { bg: "#ccc9ff", text: "#212172" };
    case 'In Progress':
      return { bg: "#b3efa7", text: "#257e30" };
    case 'Completed':
      return { bg: "#eaf1fe", text: "#174491" };
    case 'Not Started':
      return { bg: "#ffe4e6", text: "#d946ef" };
    default:
      return { bg: "#E5DEFF", text: "#6E59A5" };
  }
};
