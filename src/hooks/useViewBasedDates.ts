
import { useMemo } from 'react';
import { startOfWeek, subWeeks, addWeeks } from 'date-fns';
import { ViewOption } from '@/components/resources/filters/ViewSelector';
import { viewOptionToPeriod } from '@/pages/ProjectResourcing/utils/viewUtils';

interface UseViewBasedDatesProps {
  selectedView: ViewOption;
}

export const useViewBasedDates = ({ selectedView }: UseViewBasedDatesProps) => {
  return useMemo(() => {
    // Get current week (Monday as start of week)
    const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    
    // Start from current week minus 1 week as requested
    const startDate = subWeeks(currentWeek, 1);
    
    // Get period in weeks based on view option
    const periodInWeeks = viewOptionToPeriod(selectedView);
    
    console.log(`useViewBasedDates - View: ${selectedView}, Period: ${periodInWeeks} weeks`);
    console.log(`Current week: ${currentWeek.toISOString()}`);
    console.log(`Start date (current week - 1): ${startDate.toISOString()}`);
    
    return {
      startDate,
      periodToShow: periodInWeeks
    };
  }, [selectedView]);
};
