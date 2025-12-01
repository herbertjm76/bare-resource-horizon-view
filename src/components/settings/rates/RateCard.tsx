
import React from 'react';
import { ItemActions } from '../common/ItemActions';

interface RateCardProps {
  name: string;
  value: number;
  unit: string;
  type: "role" | "location";
  onEdit?: () => void;
  onDelete?: () => void;
}

export const RateCard = ({ name, value, unit, type, onEdit, onDelete }: RateCardProps) => {
  return (
    <div className="group flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex flex-col gap-1">
        <div className="font-medium text-foreground">{name}</div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="font-semibold text-base">${value.toFixed(2)}</span>
          <span className="text-xs bg-theme-primary/10 px-2 py-0.5 rounded-full">
            per {unit}
          </span>
        </div>
      </div>
      <ItemActions onEdit={onEdit} onDelete={onDelete} showDelete={true} />
    </div>
  );
};
