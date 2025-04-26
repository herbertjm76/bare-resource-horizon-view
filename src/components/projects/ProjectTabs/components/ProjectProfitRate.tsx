
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign } from 'lucide-react';

interface ProjectProfitRateProps {
  profit: string;
  avgRate: string;
  onProfitChange: (value: string) => void;
  onAvgRateChange: (value: string) => void;
  onCalculatorOpen: () => void;
}

export const ProjectProfitRate: React.FC<ProjectProfitRateProps> = ({
  profit,
  avgRate,
  onProfitChange,
  onAvgRateChange,
  onCalculatorOpen,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="profit" className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />Target Profit (%)
        </Label>
        <Input
          id="profit"
          type="number"
          min="0"
          max="100"
          placeholder="Enter target profit percentage"
          value={profit}
          onChange={(e) => onProfitChange(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="avgRate" className="flex items-center gap-1">
          <Calculator className="w-4 h-4" />Average Rate ($/hr)
        </Label>
        <div className="flex gap-2">
          <Input
            id="avgRate"
            type="number"
            placeholder="Enter hourly rate"
            value={avgRate}
            onChange={(e) => onAvgRateChange(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={onCalculatorOpen}
            title="Calculate Average Rate"
          >
            <Calculator className="w-4 h-4 mr-1" />
            Calculate
          </Button>
        </div>
      </div>
    </div>
  );
};
