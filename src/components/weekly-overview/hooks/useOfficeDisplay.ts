
import React from 'react';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';

export const useOfficeDisplay = () => {
  const { locations } = useOfficeSettings();
  
  // Get formatted office display based on location code
  const getOfficeDisplay = React.useCallback((locationCode: string) => {
    // Handle special cases
    if (!locationCode || locationCode === 'Unassigned') {
      return 'Unassigned';
    }
    
    // Find office in our settings data
    const office = locations.find(loc => loc.code === locationCode);
    
    if (!office) {
      return locationCode;
    }
    
    // Format with emoji if available
    return office.emoji 
      ? `${office.emoji} ${office.code}`
      : `${office.code} (${office.city})`;
  }, [locations]);
  
  return { getOfficeDisplay };
};
