
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface Holiday {
  id: string;
  name: string;
  date: string;
  office: string;
  type: 'public' | 'company';
}

export const useHolidays = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { company } = useCompany();

  useEffect(() => {
    const fetchHolidays = async () => {
      if (!company?.id) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching holidays for company:', company.id);
        
        // Fetch holidays with office location data
        const { data: holidayData, error: holidayError } = await supabase
          .from('office_holidays')
          .select(`
            id,
            name,
            date,
            end_date,
            is_recurring,
            office_locations (
              id,
              city,
              country,
              code
            )
          `)
          .eq('company_id', company.id)
          .gte('date', new Date().toISOString().split('T')[0]) // Only upcoming holidays
          .order('date', { ascending: true })
          .limit(10);

        if (holidayError) {
          throw holidayError;
        }

        // Transform the data to match the Holiday interface
        const transformedHolidays: Holiday[] = (holidayData || []).map(holiday => ({
          id: holiday.id,
          name: holiday.name,
          date: holiday.date,
          office: holiday.office_locations 
            ? `${holiday.office_locations.city}, ${holiday.office_locations.country}`
            : 'All Offices',
          type: 'company' as const // All holidays from office_holidays are company holidays
        }));

        console.log('Loaded holidays from database:', transformedHolidays);
        setHolidays(transformedHolidays);
        setError(null);
      } catch (err) {
        console.error('Error fetching holidays:', err);
        setError('Failed to load holidays');
        setHolidays([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, [company?.id]);

  return { holidays, isLoading, error };
};
