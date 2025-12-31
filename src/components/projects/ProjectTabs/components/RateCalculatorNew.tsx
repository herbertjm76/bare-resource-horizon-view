
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Option {
  id: string;
  name: string;
  rate?: number;
  country?: string; // For locations
}

interface RateCalculatorProps {
  options: Option[];
  type: 'roles' | 'locations';
  onCancel: () => void;
  onApply: (avgRate: string) => void;
  onTypeChange: (type: 'roles' | 'locations') => void;
}

export const RateCalculatorNew: React.FC<RateCalculatorProps> = ({
  options,
  type,
  onCancel,
  onApply,
  onTypeChange
}) => {
  const [peopleCount, setPeopleCount] = useState<Record<string, number>>({});
  
  useEffect(() => {
    setPeopleCount({});
  }, [type, options]);

  const calculateAverageRate = () => {
    let totalCost = 0;
    let totalPeople = 0;

    options.forEach(option => {
      const count = peopleCount[option.id] || 0;
      const rate = option.rate || 0;
      
      totalCost += rate * count;
      totalPeople += count;
    });

    return totalPeople > 0 
      ? (totalCost / totalPeople).toFixed(2) 
      : '';
  };

  const handleInputChange = (id: string, value: number) => {
    setPeopleCount(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <Card className="p-6 max-w-lg w-full mx-auto relative z-50 shadow-xl">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-brand-accent">
          <Calculator className="w-5 h-5" />Average Rate Calculator
        </h2>
        
        <div className="mb-4">
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select calculation basis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roles">By Roles</SelectItem>
              <SelectItem value="locations">By Locations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {`Select number of people by ${type === 'roles' ? 'role' : 'location'} to calculate the average rate.`}
        </p>
        
        <div className="bg-muted/30 p-4 rounded-md space-y-3 mb-6 max-h-[300px] overflow-y-auto">
          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No {type} found. Please add {type} in office settings first.
            </p>
          ) : (
            options.map(option => (
              <div className="flex items-center gap-3" key={option.id}>
                <div className="w-36">
                  <div className="font-medium text-sm text-foreground">
                    {option.name}
                  </div>
                  {option.country && type === 'locations' && (
                    <span className="text-sm text-black/70 font-bold block">
                      {option.country}
                    </span>
                  )}
                </div>
                <Input
                  type="number"
                  value={peopleCount[option.id] || ''}
                  min={0}
                  onChange={e => handleInputChange(option.id, Number(e.target.value) || 0)}
                  placeholder="# People"
                  className="w-28"
                />
                {option.rate !== undefined ? (
                  <span className="text-sm text-muted-foreground">
                    Rate: ${option.rate.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-sm text-red-500">
                    No rate set
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mb-6 p-3 border rounded-md bg-card-gradient-end">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm">Calculated Average Rate:</span>
            <span className="text-brand-accent font-bold text-base">
              ${calculateAverageRate() || '--'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Formula: Sum(Rate × People) ÷ Total People
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const avgRate = calculateAverageRate();
              if (avgRate) {
                onApply(avgRate);
              } else {
                toast.warning("Please add people to calculate an average rate");
              }
            }}
            type="button"
            disabled={!calculateAverageRate()}
          >
            Apply Rate
          </Button>
        </div>
      </Card>
    </div>
  );
};
