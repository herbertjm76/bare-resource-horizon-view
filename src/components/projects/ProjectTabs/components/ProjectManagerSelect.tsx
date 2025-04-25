
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';

interface ProjectManagerSelectProps {
  value: string;
  managers: Array<{ id: string; name: string }>;
  onChange: (value: string) => void;
}

export const ProjectManagerSelect: React.FC<ProjectManagerSelectProps> = ({
  value,
  managers,
  onChange,
}) => {
  return (
    <div>
      <Label htmlFor="manager" className="flex items-center gap-1">
        <Users className="w-4 h-4" />Project Manager
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a project manager" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Select a project manager</SelectItem>
          <SelectItem value="not_assigned">Not Assigned</SelectItem>
          {managers.map((manager) => (
            <SelectItem key={manager.id} value={manager.id}>
              {manager.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
