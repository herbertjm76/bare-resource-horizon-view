
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

interface ContractTimelineSectionProps {
  form: any;
  onChange: (key: string, value: any) => void;
}

export const ContractTimelineSection: React.FC<ContractTimelineSectionProps> = ({
  form,
  onChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Contract Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contract_start_date">Contract Start Date</Label>
            <Input
              id="contract_start_date"
              type="date"
              value={form.contract_start_date || ''}
              onChange={(e) => onChange('contract_start_date', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contract_end_date">Contract End Date</Label>
            <Input
              id="contract_end_date"
              type="date"
              value={form.contract_end_date || ''}
              onChange={(e) => onChange('contract_end_date', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
