
import React from 'react';
import { Holiday } from './types';
import { HolidayListItem } from './HolidayListItem';
import { format, isSameYear } from 'date-fns';

interface HolidayYearlyListProps {
  holidays: Holiday[];
  selectedYear: Date;
  selected: string[];
  editMode: boolean;
  onEdit: (holiday: Holiday) => void;
  onSelect: (id: string) => void;
  loading: boolean;
}

export const HolidayYearlyList: React.FC<HolidayYearlyListProps> = ({
  holidays,
  selectedYear,
  selected,
  editMode,
  onEdit,
  onSelect,
  loading
}) => {
  const yearlyHolidays = holidays.filter(holiday => 
    isSameYear(holiday.date, selectedYear)
  );

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="text-muted-foreground">Loading holidays...</div>
      </div>
    );
  }
  
  if (yearlyHolidays.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md border-dashed">
        <div className="text-muted-foreground">
          No holidays in {format(selectedYear, 'yyyy')}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Click "Add Holiday" to create your first holiday for this year.
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-4">
        {yearlyHolidays.length} holiday{yearlyHolidays.length !== 1 ? 's' : ''} in {format(selectedYear, 'yyyy')}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {yearlyHolidays.map((holiday) => (
          <HolidayListItem
            key={holiday.id}
            holiday={holiday}
            onEdit={onEdit}
            isSelected={selected.includes(holiday.id)}
            onSelect={onSelect}
            editMode={editMode}
          />
        ))}
      </div>
    </div>
  );
};
