import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Users, Briefcase } from 'lucide-react';

interface ResourceTypeToggleProps {
  value: 'role' | 'member';
  onChange: (value: 'role' | 'member') => void;
}

export const ResourceTypeToggle: React.FC<ResourceTypeToggleProps> = ({
  value,
  onChange
}) => {
  return (
    <ToggleGroup 
      type="single" 
      value={value} 
      onValueChange={(v) => v && onChange(v as 'role' | 'member')}
      className="justify-start"
    >
      <ToggleGroupItem 
        value="role" 
        aria-label="By Role"
        className="gap-1.5 text-xs"
      >
        <Briefcase className="h-3.5 w-3.5" />
        By Role
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="member" 
        aria-label="By Team Member"
        className="gap-1.5 text-xs"
      >
        <Users className="h-3.5 w-3.5" />
        By Member
      </ToggleGroupItem>
    </ToggleGroup>
  );
};
