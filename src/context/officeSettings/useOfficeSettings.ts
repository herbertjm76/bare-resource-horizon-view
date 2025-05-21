
import { useContext } from 'react';
import { OfficeSettingsContext } from './OfficeSettingsContext';
import { OfficeSettingsContextType } from './types';

export const useOfficeSettings = (): OfficeSettingsContextType => {
  const context = useContext(OfficeSettingsContext);
  if (!context) {
    throw new Error('useOfficeSettings must be used within an OfficeSettingsProvider');
  }
  return context;
};
