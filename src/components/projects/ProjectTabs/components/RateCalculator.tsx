
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  rate?: number;
}

interface RateCalculatorProps {
  roles: Role[];
  onCancel: () => void;
  onApply: (avgRate: string) => void;
}

export const RateCalculator: React.FC<RateCalculatorProps> = ({
  roles,
  onCancel,
  onApply
}) => {
  const [roleNumbers, setRoleNumbers] = useState<Record<string, number>>({});

  const calculateAvgRate = (): string => {
    let totalPeople = 0;
    let totalRateValue = 0;

    for (const roleId in roleNumbers) {
      const numPeople = roleNumbers[roleId];
      if (numPeople) {
        totalPeople += numPeople;
        
        const role = roles.find(r => r.id === roleId);
        if (role && role.rate) {
          totalRateValue += role.rate * numPeople;
        }
      }
    }

    if (totalPeople === 0) return '';
    return (totalRateValue / totalPeople).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <Card className="p-6 max-w-lg mx-auto w-full relative z-50 shadow-xl">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />Average Rate Calculator
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Specify how many people per role will work on this project to calculate the average rate.
        </p>
        <div className="bg-muted/30 p-4 rounded-md space-y-3 mb-6">
          {roles.map(role => (
            <div className="flex items-center gap-3" key={role.id}>
              <span className="w-36 font-medium">{role.name}</span>
              <Input
                type="number"
                value={roleNumbers[role.id] || ''}
                min={0}
                onChange={e => setRoleNumbers(rns => ({
                  ...rns,
                  [role.id]: Number(e.target.value) || 0
                }))}
                placeholder="# People"
                className="w-28"
              />
              {role.rate !== undefined && (
                <span className="text-sm text-muted-foreground">Rate: ${role.rate}</span>
              )}
            </div>
          ))}
        </div>
        <div className="mb-6 p-3 border rounded-md bg-muted/20">
          <div className="flex justify-between">
            <span className="font-medium">Calculated Average Rate:</span>
            <span className="font-bold text-lg">${calculateAvgRate() || '--'}</span>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => onApply(calculateAvgRate())}
            type="button"
            disabled={!calculateAvgRate()}
          >
            Apply Rate
          </Button>
        </div>
      </Card>
    </div>
  );
};
