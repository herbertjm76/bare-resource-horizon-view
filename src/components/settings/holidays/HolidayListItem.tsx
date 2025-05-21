
import React from 'react';
import { format } from 'date-fns';
import { Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Holiday } from './types';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';

interface HolidayListItemProps {
  holiday: Holiday;
  onEdit: (holiday: Holiday) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
  editMode: boolean;
}

export const HolidayListItem: React.FC<HolidayListItemProps> = ({
  holiday,
  onEdit,
  isSelected,
  onSelect,
  editMode
}) => {
  const { locations } = useOfficeSettings();
  
  const getLocationNames = () => {
    return holiday.offices
      .map(id => locations.find(o => o.id === id)?.city)
      .filter(Boolean)
      .join(", ");
  };
  
  return (
    <div 
      className={`flex items-center justify-between p-3 border rounded-md ${editMode && "ring-2"}`}
      style={editMode && isSelected ? { borderColor: "#dc2626", background: "#fee2e2" } : {}}
    >
      <div>
        <div className="font-medium">{holiday.name}</div>
        <div className="text-sm text-muted-foreground">
          {format(holiday.date, "PPP")} • {getLocationNames()}
        </div>
      </div>
      {editMode ? (
        <input
          type="checkbox"
          className="w-4 h-4 accent-purple-600"
          checked={isSelected}
          onChange={() => onSelect(holiday.id)}
        />
      ) : (
        <Button variant="ghost" size="sm" onClick={() => onEdit(holiday)}>
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
