
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check } from 'lucide-react';

type ResourceOption = {
  id: string;
  name: string;
  email: string;
  type: 'active' | 'pre-registered';
  role?: string;
  department?: string;
  location?: string;
  avatar_url?: string | null;
};

interface ResourceSelectOptionProps {
  member: ResourceOption;
  isSelected?: boolean;
}

export const ResourceSelectOption: React.FC<ResourceSelectOptionProps> = ({ member, isSelected }) => {
  const firstName = member.name.split(' ')[0];
  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={member.avatar_url || undefined} alt={member.name} />
          <AvatarFallback className="text-sm">{initials}</AvatarFallback>
        </Avatar>
        {isSelected && (
          <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
      </div>
      <span className="text-xs text-center font-medium truncate w-full">{firstName}</span>
    </>
  );
};
