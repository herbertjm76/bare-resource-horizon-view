import { useMemo } from 'react';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';

export interface RateCalculation {
  referenceId: string;
  referenceName: string;
  referenceType: 'role' | 'location';
  rateValue: number;
  currency: string;
}

export const useRateCalculations = (rateBasisStrategy: 'role_based' | 'location_based') => {
  const { roles, locations, rates } = useOfficeSettings();

  const availableReferences = useMemo(() => {
    if (rateBasisStrategy === 'role_based') {
      return roles.map(role => ({
        id: role.id,
        name: role.name,
        code: role.code,
        type: 'role' as const
      }));
    } else {
      return locations.map(location => ({
        id: location.id,
        name: `${location.city}, ${location.country}`,
        code: location.code,
        type: 'location' as const
      }));
    }
  }, [rateBasisStrategy, roles, locations]);

  const getRateForReference = useMemo(() => {
    return (referenceId: string) => {
      const rate = rates.find(r => 
        r.reference_id === referenceId && 
        r.type === (rateBasisStrategy === 'role_based' ? 'role' : 'location')
      );
      return rate?.value || 0;
    };
  }, [rates, rateBasisStrategy]);

  const calculateBudget = useMemo(() => {
    return (composition: Array<{
      referenceId: string;
      plannedQuantity: number;
      plannedHoursPerPerson: number;
    }>) => {
      return composition.reduce((total, item) => {
        const rate = getRateForReference(item.referenceId);
        const totalHours = item.plannedQuantity * item.plannedHoursPerPerson;
        return total + (totalHours * rate);
      }, 0);
    };
  }, [getRateForReference]);

  const calculateTotalHours = useMemo(() => {
    return (composition: Array<{
      plannedQuantity: number;
      plannedHoursPerPerson: number;
    }>) => {
      return composition.reduce((total, item) => {
        return total + (item.plannedQuantity * item.plannedHoursPerPerson);
      }, 0);
    };
  }, []);

  return {
    availableReferences,
    getRateForReference,
    calculateBudget,
    calculateTotalHours
  };
};