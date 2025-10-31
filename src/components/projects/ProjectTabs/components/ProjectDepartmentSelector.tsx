import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProjectDepartmentSelectorProps {
  department?: string;
  departments: Array<{ id: string; name: string; icon?: string }>;
  onDepartmentChange: (value: string) => void;
}

export const ProjectDepartmentSelector: React.FC<ProjectDepartmentSelectorProps> = ({
  department,
  departments,
  onDepartmentChange
}) => {
  return (
    <div>
      <Label>Department</Label>
      <Select value={department} onValueChange={onDepartmentChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.name}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
