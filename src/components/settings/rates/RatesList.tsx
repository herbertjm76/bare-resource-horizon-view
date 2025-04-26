
import React from 'react';
import { Button } from "@/components/ui/button";
import { RateCard } from './RateCard';

type RatesListProps = {
  title: string;
  type: "role" | "location";
  rates: Array<{
    id: string;
    type: "role" | "location";
    reference_id: string;
    value: number;
    unit: "hour" | "day" | "week";
  }>;
  getRateName: (rate: any) => string;
  onAddRate: () => void;
};

export const RatesList = ({ title, type, rates, getRateName, onAddRate }: RatesListProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#6E59A5]">{title}</h3>
        <span className="text-sm text-muted-foreground">
          {rates.length} {rates.length === 1 ? 'rate' : 'rates'}
        </span>
      </div>
      {rates.length === 0 ? (
        <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
          <p className="text-muted-foreground">No {type} rates defined yet</p>
          <Button 
            variant="link" 
            onClick={onAddRate} 
            className="mt-2"
          >
            Add your first {type} rate
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {rates.map((rate) => (
            <RateCard
              key={rate.id}
              name={getRateName(rate)}
              value={rate.value}
              unit={rate.unit}
              type={rate.type}
              onEdit={() => {/* Add edit handler */}}
            />
          ))}
        </div>
      )}
    </div>
  );
};
