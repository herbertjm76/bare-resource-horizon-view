
import React from 'react';
import { Calendar } from '@/components/ui/calendar';

interface DatePickerCalendarProps {
  calendarDate: Date;
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  onMonthChange: (date: Date) => void;
}

export const DatePickerCalendar = ({
  calendarDate,
  selected,
  onSelect,
  onMonthChange
}: DatePickerCalendarProps) => {
  return (
    <Calendar
      key={calendarDate.toISOString()}
      mode="single"
      selected={selected}
      onSelect={onSelect}
      month={calendarDate}
      onMonthChange={onMonthChange}
      className="p-0 pointer-events-auto"
      classNames={{
        nav: "hidden",
        caption: "hidden"
      }}
      components={{
        IconLeft: () => null,
        IconRight: () => null,
        Caption: () => null
      }}
    />
  );
};
