
import React from 'react';
import { Holiday } from './types';
import { HolidayListItem } from './HolidayListItem';
import { format, isSameMonth } from 'date-fns';

interface HolidayMonthlyListProps {
  holidays: Holiday[];
  selectedMonth: Date;
  selected: string[];
  editMode: boolean;
  onEdit: (holiday: Holiday) => void;
  onSelect: (id: string) => void;
  loading: boolean;
}

export const HolidayMonthlyList: React.FC<HolidayMonthlyListProps> = ({
  holidays,
  selectedMonth,
  selected,
  editMode,
  onEdit,
  onSelect,
  loading
}) => {
  const monthlyHolidays = holidays.filter(holiday => 
    isSameMonth(holiday.date, selectedMonth)
  );

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="text-muted-foreground">Loading holidays...</div>
      </div>
    );
  }
  
  if (monthlyHolidays.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md border-dashed">
        <div className="text-muted-foreground">
          No holidays in {format(selectedMonth, 'MMMM yyyy')}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Click "Add Holiday" to create your first holiday for this month.
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-4">
        {monthlyHolidays.length} holiday{monthlyHolidays.length !== 1 ? 's' : ''} in {format(selectedMonth, 'MMMM yyyy')}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {monthlyHolidays.map((holiday) => (
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
