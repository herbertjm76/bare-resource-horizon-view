
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { format, isSameMonth, isSameYear } from 'date-fns';
import { Holiday } from './types';
import { useOfficeSettings } from '@/context/officeSettings';
import { colors } from '@/styles/colors';

interface HolidayMonthlyViewProps {
  holidays: Holiday[];
  selectedYear: Date;
  selected: string[];
  editMode: boolean;
  onEdit: (holiday: Holiday) => void;
  onSelect: (id: string) => void;
  loading: boolean;
}

export const HolidayMonthlyView: React.FC<HolidayMonthlyViewProps> = ({
  holidays,
  selectedYear,
  selected,
  editMode,
  onEdit,
  onSelect,
  loading
}) => {
  const { locations } = useOfficeSettings();
  
  const shortMonths = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  const getMonthHolidays = (monthIndex: number) => {
    const monthDate = new Date(selectedYear.getFullYear(), monthIndex, 1);
    return holidays.filter(holiday => 
      isSameMonth(holiday.date, monthDate) && isSameYear(holiday.date, selectedYear)
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

  if (loading) {
    return (
      <div className="text-center p-6">
        <div className="text-muted-foreground">Loading holidays...</div>
      </div>
    );
  }

  // Filter out months with no holidays
  const monthsWithHolidays = shortMonths
    .map((month, index) => ({ month, index, holidays: getMonthHolidays(index) }))
    .filter(({ holidays }) => holidays.length > 0);

  if (monthsWithHolidays.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg border-dashed">
        <div className="text-muted-foreground">
          No holidays in {format(selectedYear, 'yyyy')}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Click "Add Holiday" to create holidays for this year.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {monthsWithHolidays.map(({ month, index, holidays: monthHolidays }) => (
        <Card key={month} className="h-fit border-2" style={{ borderColor: colors.brand.border }}>
          <CardHeader className="pb-2 p-3">
            <CardTitle 
              className="text-center text-gray-700 py-2 px-3 rounded-md text-sm font-semibold"
              style={{ backgroundColor: '#EFF4FF' }}
            >
              {month}
              <span className="ml-2 bg-white/60 rounded-full px-2 py-0.5 text-xs">
                {monthHolidays.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-3">
            <div className="space-y-2">
              {monthHolidays.map((holiday) => (
                <div 
                  key={holiday.id}
                  className={`p-2 rounded-md border transition-colors ${
                    editMode 
                      ? 'cursor-pointer hover:bg-gray-50' 
                      : 'bg-gray-50/50'
                  } ${
                    selected.includes(holiday.id) ? 'ring-2 ring-theme-primary bg-theme-primary/10' : ''
                  }`}
                  onClick={() => editMode && onSelect(holiday.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold" style={{ color: colors.brand.primary }}>
                          {format(holiday.date, 'M/dd')}
                        </span>
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {holiday.name}
                        </span>
                      </div>
                      {holiday.offices && holiday.offices.length > 0 && (
                        <div className="text-xs text-gray-600 truncate">
                          {getOfficeNames(holiday.offices)}
                        </div>
                      )}
                    </div>
                    
                    {!editMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(holiday);
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
