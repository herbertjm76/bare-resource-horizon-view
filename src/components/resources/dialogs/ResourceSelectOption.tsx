
import React from 'react';

type ResourceOption = {
  id: string;
  name: string;
  email: string;
  type: 'active' | 'pre-registered';
  role?: string;
};

interface ResourceSelectOptionProps {
  member: ResourceOption;
}

export const ResourceSelectOption: React.FC<ResourceSelectOptionProps> = ({ member }) => {
  return (
    <div className="flex flex-col gap-0.5 w-full">
      <span className="font-medium text-sm">{member.name}</span>
      {member.role && (
        <span className="text-xs text-muted-foreground">{member.role}</span>
      )}
    </div>
  );
};
