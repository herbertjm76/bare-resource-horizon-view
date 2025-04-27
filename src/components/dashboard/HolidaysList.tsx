
import React from 'react';
import { Calendar } from 'lucide-react';

interface Holiday {
  date: string;
  name: string;
  offices: string[];
}

interface HolidaysListProps {
  holidays: Holiday[];
}

export const HolidaysList: React.FC<HolidaysListProps> = ({ holidays }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Upcoming Holidays</h3>
      <div className="space-y-2">
        {holidays.map((holiday, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-semibold">
                {new Date(holiday.date).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short'
                }).toUpperCase()}
              </span>
              <span className="text-sm">{holiday.name}</span>
            </div>
            <span className="text-sm text-gray-600">{holiday.offices.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
