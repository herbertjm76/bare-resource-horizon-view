
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
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Holidays</h3>
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {holidays.map((holiday, index) => (
          <div key={index} className="flex gap-3 items-start">
            <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">{holiday.name}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{new Date(holiday.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</span>
                <span>•</span>
                <span>{holiday.offices.join(', ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
