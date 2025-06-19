
import React from 'react';
import { Holiday } from './types';
import { HolidayListItem } from './HolidayListItem';

interface HolidayListProps {
  holidays: Holiday[];
  selected: string[];
  editMode: boolean;
  onEdit: (holiday: Holiday) => void;
  onSelect: (id: string) => void;
  loading: boolean;
}

export const HolidayList: React.FC<HolidayListProps> = ({
  holidays,
  selected,
  editMode,
  onEdit,
  onSelect,
  loading
}) => {
  if (loading) {
    return (
      <div className="text-center p-4 border rounded-md border-dashed">Loading...</div>
    );
  }
  
  if (holidays.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md border-dashed">
        No holidays added yet. Click "Add Holiday" to get started.
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {holidays.map((holiday) => (
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
  );
};
