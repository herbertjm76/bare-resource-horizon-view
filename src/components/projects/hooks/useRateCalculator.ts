
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { logger } from '@/utils/logger';

export const useRateCalculator = () => {
  const { company } = useCompany();
  const { locations, roles } = useOfficeSettings();
  const [showRateCalc, setShowRateCalc] = useState(false);
  const [rateOptions, setRateOptions] = useState<Array<{ id: string; name: string; rate?: number; country?: string }>>([]);
  const [calculatorType, setCalculatorType] = useState<'roles' | 'locations'>('roles');

  const loadRateOptions = async (type: 'roles' | 'locations') => {
    try {
      logger.debug(`Loading ${type} data for rate calculator...`);
      
      // First get base data from context or fetch if needed
      let baseData = [];
      if (type === 'roles') {
        baseData = roles;
        logger.debug(`Using ${roles.length} roles from context`);
      } else {
        baseData = locations;
        logger.debug(`Using ${locations.length} locations from context`);
      }

      if (baseData.length === 0) {
        logger.debug(`No ${type} data found in context, fetching from database`);
        if (type === 'roles') {
          const { data, error } = await supabase
            .from('office_roles')
            .select('id, name, code')
            .eq('company_id', company?.id);
            
          if (error) {
            console.error(`Error fetching roles:`, error);
            toast.error(`Failed to load roles data for rate calculator`);
            return;
          }
          baseData = data || [];
        } else {
          const { data, error } = await supabase
            .from('office_locations')
            .select('id, city as name, country')
            .eq('company_id', company?.id);
            
          if (error) {
            console.error(`Error fetching locations:`, error);
            toast.error(`Failed to load locations data for rate calculator`);
            return;
          }
          baseData = data || [];
        }
      }

      logger.debug(`Using ${baseData.length} ${type} records:`, baseData);
      
      if (baseData.length > 0) {
        const rateType = type === 'roles' ? 'role' : 'location';
        
        // Get all rates in a single query for better performance
        const { data: allRates, error: ratesError } = await supabase
          .from('office_rates')
          .select('reference_id, value')
          .eq('type', rateType)
          .eq('company_id', company?.id);

        if (ratesError) {
          console.error(`Error fetching ${type} rates:`, ratesError);
          toast.error(`Failed to load rates for ${type}`);
          return;
        }

        logger.debug(`Fetched ${allRates?.length || 0} rates for ${type}`);
        
        // Create a map of reference_id to rate for easy lookup
        const rateMap = new Map();
        if (allRates) {
          allRates.forEach(rate => {
            rateMap.set(rate.reference_id, Number(rate.value));
          });
        }
        
        // Map the base data to include rates
        const enrichedOptions = baseData.map(option => {
          const rate = rateMap.get(option.id) || 0;
          return {
            ...option,
            rate
          };
        });

        logger.debug(`Enriched ${type} options:`, enrichedOptions);
        setRateOptions(enrichedOptions);
      } else {
        setRateOptions([]);
        toast.info(`No ${type} found for this company`);
      }
    } catch (err) {
      console.error(`Error in loadRateOptions for ${type}:`, err);
      toast.error(`Failed to load ${type} data for rate calculator`);
      setRateOptions([]);
    }
  };

  const openRateCalculator = async () => {
    if (!company?.id) {
      toast.error("Company context not found");
      return;
    }

    await loadRateOptions(calculatorType);
    setShowRateCalc(true);
  };

  const handleRateTypeChange = async (type: 'roles' | 'locations') => {
    setCalculatorType(type);
    await loadRateOptions(type);
  };

  return {
    showRateCalc,
    setShowRateCalc,
    rateOptions,
    calculatorType,
    openRateCalculator,
    handleRateTypeChange,
  };
};
