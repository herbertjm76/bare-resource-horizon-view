
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format, isSameMonth, isSameYear } from 'date-fns';
import { Holiday } from './types';

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
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getMonthHolidays = (monthIndex: number) => {
    const monthDate = new Date(selectedYear.getFullYear(), monthIndex, 1);
    return holidays.filter(holiday => 
      isSameMonth(holiday.date, monthDate) && isSameYear(holiday.date, selectedYear)
    );
  };

  const getMonthColor = (monthIndex: number) => {
    const colors = [
      'from-blue-400 to-blue-500',    // January
      'from-purple-400 to-purple-500', // February  
      'from-green-400 to-green-500',   // March
      'from-orange-400 to-orange-500', // April
      'from-red-400 to-red-500',       // May
      'from-pink-400 to-pink-500',     // June
      'from-yellow-400 to-yellow-500', // July
      'from-indigo-400 to-indigo-500', // August
      'from-teal-400 to-teal-500',     // September
      'from-cyan-400 to-cyan-500',     // October
      'from-emerald-400 to-emerald-500', // November
      'from-violet-400 to-violet-500'  // December
    ];
    return colors[monthIndex];
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="text-muted-foreground">Loading holidays...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {months.map((month, monthIndex) => {
        const monthHolidays = getMonthHolidays(monthIndex);
        const hasHolidays = monthHolidays.length > 0;
        
        return (
          <Card key={month} className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className={`text-center text-white py-3 rounded-lg bg-gradient-to-r ${getMonthColor(monthIndex)}`}>
                {month}
                {hasHolidays && (
                  <span className="ml-2 bg-white/20 rounded-full px-2 py-1 text-xs">
                    {monthHolidays.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {hasHolidays ? (
                <div className="space-y-3">
                  {monthHolidays.map((holiday) => (
                    <div 
                      key={holiday.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        editMode 
                          ? 'cursor-pointer hover:bg-gray-50' 
                          : 'bg-gray-50'
                      } ${
                        selected.includes(holiday.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => editMode && onSelect(holiday.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-600">
                              {format(holiday.date, 'M/dd')}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {holiday.name}
                            </span>
                          </div>
                          {holiday.offices && holiday.offices.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {holiday.offices.length} office{holiday.offices.length !== 1 ? 's' : ''}
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
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-sm">No holidays in {month}</div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
