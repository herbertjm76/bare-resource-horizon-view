
import { useMemo } from 'react';
import { startOfWeek, subWeeks, addWeeks } from 'date-fns';
import { ViewOption } from '@/components/resources/filters/ViewSelector';
import { viewOptionToPeriod } from '@/pages/ProjectResourcing/utils/viewUtils';

interface UseViewBasedDatesProps {
  selectedView: ViewOption;
}

export const useViewBasedDates = ({ selectedView }: UseViewBasedDatesProps) => {
  return useMemo(() => {
    const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const startDate = subWeeks(currentWeek, 1); // Current week - 1 week
    const periodInWeeks = viewOptionToPeriod(selectedView);
    
    console.log(`useViewBasedDates - View: ${selectedView}, Period: ${periodInWeeks} weeks`);
    console.log(`Start date: ${startDate.toISOString()}`);
    
    return {
      startDate,
      periodToShow: periodInWeeks
    };
  }, [selectedView]);
};
