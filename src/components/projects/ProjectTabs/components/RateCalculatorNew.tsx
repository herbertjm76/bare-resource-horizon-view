
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';

interface Option {
  id: string;
  name: string;
  rate?: number;
}

interface RateCalculatorProps {
  options: Option[];
  type: 'roles' | 'locations';
  onCancel: () => void;
  onApply: (avgRate: string) => void;
}

export const RateCalculatorNew: React.FC<RateCalculatorProps> = ({
  options,
  type,
  onCancel,
  onApply
}) => {
  const [peopleCount, setPeopleCount] = useState<Record<string, number>>({});

  const calculateAverageRate = useMemo(() => {
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
  }, [options, peopleCount]);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <Card className="p-6 max-w-lg w-full mx-auto relative z-50 shadow-xl">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#6E59A5]">
          <Calculator className="w-5 h-5" />Average Rate Calculator
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {`Select number of people by ${type === 'roles' ? 'role' : 'location'}`}
        </p>
        <div className="bg-muted/30 p-4 rounded-md space-y-3 mb-6">
          {options.map(option => (
            <div className="flex items-center gap-3" key={option.id}>
              <span className="w-36 font-medium">{option.name}</span>
              <Input
                type="number"
                value={peopleCount[option.id] || ''}
                min={0}
                onChange={e => {
                  const value = Number(e.target.value) || 0;
                  setPeopleCount(prev => ({
                    ...prev,
                    [option.id]: value
                  }));
                }}
                placeholder="# People"
                className="w-28"
              />
              {option.rate !== undefined && (
                <span className="text-sm text-muted-foreground">
                  Rate: ${option.rate.toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mb-6 p-3 border rounded-md bg-[#F8F4FF]">
          <div className="flex justify-between items-center">
            <span className="font-medium">Calculated Average Rate:</span>
            <span className="text-[#6E59A5] font-bold text-lg">
              ${calculateAverageRate || '--'}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => calculateAverageRate && onApply(calculateAverageRate)}
            type="button"
            disabled={!calculateAverageRate}
          >
            Apply Rate
          </Button>
        </div>
      </Card>
    </div>
  );
};
