import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Briefcase, Users, Lightbulb, Megaphone, ShoppingCart, HeartHandshake, Code, Palette, BarChart } from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'briefcase', label: 'Briefcase', icon: Briefcase },
  { value: 'building-2', label: 'Building', icon: Building2 },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'lightbulb', label: 'Lightbulb', icon: Lightbulb },
  { value: 'megaphone', label: 'Megaphone', icon: Megaphone },
  { value: 'shopping-cart', label: 'Shopping Cart', icon: ShoppingCart },
  { value: 'heart-handshake', label: 'Heart Handshake', icon: HeartHandshake },
  { value: 'code', label: 'Code', icon: Code },
  { value: 'palette', label: 'Palette', icon: Palette },
  { value: 'bar-chart', label: 'Bar Chart', icon: BarChart }
];

const DEPARTMENT_OPTIONS = [
  'Strategy',
  'Operations',
  'Technology',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Design',
  'Product',
  'Other'
];

interface ProjectDepartmentSelectorProps {
  department?: string;
  departmentIcon?: string;
  onDepartmentChange: (value: string) => void;
  onIconChange: (value: string) => void;
}

export const ProjectDepartmentSelector: React.FC<ProjectDepartmentSelectorProps> = ({
  department,
  departmentIcon,
  onDepartmentChange,
  onIconChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label>Department</Label>
        <Select value={department} onValueChange={onDepartmentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENT_OPTIONS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Department Icon</Label>
        <Select value={departmentIcon} onValueChange={onIconChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select icon" />
          </SelectTrigger>
          <SelectContent>
            {ICON_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
