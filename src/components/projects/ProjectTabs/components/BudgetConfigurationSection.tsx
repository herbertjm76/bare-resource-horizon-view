
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign } from 'lucide-react';

interface BudgetConfigurationSectionProps {
  derivedBudgetAmount: number;
  derivedBudgetHours: number;
  form: any;
  onChange: (key: string, value: any) => void;
}

export const BudgetConfigurationSection: React.FC<BudgetConfigurationSectionProps> = ({
  derivedBudgetAmount,
  derivedBudgetHours,
  form,
  onChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Budget Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budget_amount">Budget Amount (Calculated)</Label>
            <Input
              id="budget_amount"
              type="number"
              value={derivedBudgetAmount.toFixed(2)}
              readOnly
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Automatically calculated from stage fees
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget_hours">Budget Hours (Calculated)</Label>
            <Input
              id="budget_hours"
              type="number"
              value={derivedBudgetHours.toFixed(2)}
              readOnly
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Budget amount ÷ blended rate
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="consumed_hours">Consumed Hours</Label>
            <Input
              id="consumed_hours"
              type="number"
              placeholder="0"
              value={form.consumed_hours || ''}
              onChange={(e) => onChange('consumed_hours', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blended_rate">Blended Rate</Label>
            <Input
              id="blended_rate"
              type="number"
              placeholder="0.00"
              value={form.blended_rate || ''}
              onChange={(e) => onChange('blended_rate', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="financial_status">Financial Status</Label>
          <Select
            value={form.financial_status || 'On Track'}
            onValueChange={(value) => onChange('financial_status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="On Track">On Track</SelectItem>
              <SelectItem value="At Risk">At Risk</SelectItem>
              <SelectItem value="Over Budget">Over Budget</SelectItem>
              <SelectItem value="Under Budget">Under Budget</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
