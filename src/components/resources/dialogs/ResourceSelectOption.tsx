
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
    <div className="flex items-center justify-between w-full">
      <span>{member.name}</span>
    </div>
  );
};
