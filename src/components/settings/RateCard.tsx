
import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface RateCardProps {
  name: string;
  value: number;
  unit: string;
  type: "role" | "location";
  onEdit?: () => void;
}

export const RateCard = ({ name, value, unit, type, onEdit }: RateCardProps) => {
  return (
    <div className={cn(
      "group flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:border-[#6E59A5]/20 hover:bg-[#6E59A5]/5",
      "relative overflow-hidden"
    )}>
      <div className="flex flex-col gap-1">
        <div className="font-medium text-[#6E59A5]">{name}</div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="font-semibold text-base">${value.toFixed(2)}</span>
          <span className="text-xs bg-[#6E59A5]/10 px-2 py-0.5 rounded-full">
            per {unit}
          </span>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
};
