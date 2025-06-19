
export const generateRoleCode = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '_');
};
