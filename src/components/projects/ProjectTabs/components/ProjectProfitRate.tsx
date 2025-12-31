
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Percent, Calculator } from 'lucide-react';

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
          <Percent className="w-4 h-4" />Target Profit %
        </Label>
        <Input
          id="profit"
          type="number"
          placeholder="Enter profit percentage"
          value={profit}
          onChange={(e) => onProfitChange(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="avgRate" className="flex items-center gap-1">
          <Calculator className="w-4 h-4" />Average Rate
        </Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="avgRate"
            type="number"
            placeholder="Enter average rate"
            value={avgRate}
            onChange={(e) => onAvgRateChange(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={onCalculatorOpen} className="flex-shrink-0">
            <Calculator className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
