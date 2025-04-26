
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';

export const useRateCalculator = () => {
  const { company } = useCompany();
  const [showRateCalc, setShowRateCalc] = useState(false);
  const [rateOptions, setRateOptions] = useState<Array<{ id: string; name: string; rate?: number; country?: string }>>([]);
  const [calculatorType, setCalculatorType] = useState<'roles' | 'locations'>('roles');

  const loadRateOptions = async (type: 'roles' | 'locations') => {
    try {
      console.log(`Loading ${type} data for rate calculator...`);
      let fetchedData = [];
      
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
        fetchedData = data || [];
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
        fetchedData = data || [];
      }

      console.log(`Fetched ${fetchedData.length} ${type} records:`, fetchedData);
      
      if (fetchedData.length > 0) {
        const enrichedOptions = await Promise.all(fetchedData.map(async (option) => {
          try {
            const rateType = type === 'roles' ? 'role' : 'location';
            
            console.log(`Fetching rates for ${type} ${option.name}, reference_id: ${option.id}, using type: ${rateType}`);
            
            const { data: rateData, error } = await supabase
              .from('office_rates')
              .select('value')
              .eq('reference_id', option.id)
              .eq('type', rateType)
              .limit(1);

            if (error) {
              console.error(`Error fetching rate for ${type} ${option.name}:`, error);
              return { ...option, rate: 0 };
            }

            const rate = rateData && rateData.length > 0 ? Number(rateData[0].value) : 0;
            console.log(`Rate for ${option.name}: ${rate}`);
            
            return {
              ...option,
              rate
            };
          } catch (err) {
            console.error(`Exception fetching rate for ${option.name}:`, err);
            return { ...option, rate: 0 };
          }
        }));

        console.log(`Enriched ${type} options:`, enrichedOptions);
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
