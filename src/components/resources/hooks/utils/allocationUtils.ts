
import { format } from 'date-fns';

// Create a utility function to generate allocation keys
export const getAllocationKey = (resourceId: string, weekKey: string): string => {
  return `${resourceId}:${weekKey}`;
};

// Utility to parse the composite key
export const parseAllocationKey = (compositeKey: string): { resourceId: string, weekKey: string } => {
  const [resourceId, weekKey] = compositeKey.split(':');
  return { resourceId, weekKey };
};

// Helper to get day key for allocation lookup
export const getDayKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};
