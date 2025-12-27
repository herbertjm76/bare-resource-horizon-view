
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Pencil } from "lucide-react";
import { format, isSameMonth, isSameYear, addMonths, subMonths, startOfMonth } from 'date-fns';
import { Holiday } from './types';
import { useOfficeSettings } from '@/context/officeSettings';
import { colors } from '@/styles/colors';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface HolidayTimelineViewProps {
  holidays: Holiday[];
  selected: string[];
  editMode: boolean;
  onEdit: (holiday: Holiday) => void;
  onSelect: (id: string) => void;
  loading: boolean;
}

export const HolidayTimelineView: React.FC<HolidayTimelineViewProps> = ({
  holidays,
  selected,
  editMode,
  onEdit,
  onSelect,
  loading
}) => {
  const { locations } = useOfficeSettings();
  const currentMonthRef = useRef<HTMLDivElement>(null);
  
  // Generate months: 1 month before, current month, and 10 months ahead
  const today = new Date();
  const months = [];
  for (let i = -1; i <= 10; i++) {
    months.push(addMonths(startOfMonth(today), i));
  }

  const getMonthHolidays = (monthDate: Date) => {
    return holidays.filter(holiday => 
      isSameMonth(holiday.date, monthDate) && isSameYear(holiday.date, monthDate)
    );
  };

  const getOfficeNames = (officeIds: string[]) => {
    return officeIds
      .map(id => {
        const location = locations.find(loc => loc.id === id);
        return location ? `${location.emoji} ${location.city}` : id;
      })
      .join(", ");
  };

  const isCurrentMonth = (monthDate: Date) => {
    return isSameMonth(monthDate, today) && isSameYear(monthDate, today);
  };

  // Scroll to current month on mount
  useEffect(() => {
    if (currentMonthRef.current) {
      currentMonthRef.current.scrollIntoView({ behavior: 'auto', inline: 'start' });
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="text-muted-foreground">Loading holidays...</div>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-4 pb-4">
        {months.map((monthDate, index) => {
          const monthHolidays = getMonthHolidays(monthDate);
          const isCurrent = isCurrentMonth(monthDate);
          
          return (
            <div 
              key={format(monthDate, 'yyyy-MM')}
              ref={isCurrent ? currentMonthRef : null}
              className={`flex-shrink-0 w-64 rounded-lg border-2 ${
                isCurrent ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              {/* Month Header */}
              <div 
                className={`px-4 py-3 border-b ${
                  isCurrent ? 'bg-primary/10' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-semibold ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                      {format(monthDate, 'MMMM')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(monthDate, 'yyyy')}
                    </div>
                  </div>
                  {monthHolidays.length > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isCurrent 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {monthHolidays.length}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Month Content */}
              <div className="p-3 min-h-[120px]">
                {monthHolidays.length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    No holidays
                  </div>
                ) : (
                  <div className="space-y-2">
                    {monthHolidays.map((holiday) => (
                      <div 
                        key={holiday.id}
                        className={`p-2 rounded-md border transition-colors group ${
                          editMode 
                            ? 'cursor-pointer hover:bg-accent' 
                            : 'hover:bg-accent/50 cursor-pointer'
                        } ${
                          selected.includes(holiday.id) ? 'ring-2 ring-primary bg-primary/10' : 'bg-background'
                        }`}
                        onClick={() => {
                          if (editMode) {
                            onSelect(holiday.id);
                          } else {
                            onEdit(holiday);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-primary whitespace-nowrap">
                                {format(holiday.date, 'MMM d')}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-foreground line-clamp-2 whitespace-normal">
                              {holiday.name}
                            </span>
                            {holiday.offices && holiday.offices.length > 0 && (
                              <div className="text-xs text-muted-foreground truncate mt-1">
                                {getOfficeNames(holiday.offices)}
                              </div>
                            )}
                          </div>
                          
                          {!editMode && (
                            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
