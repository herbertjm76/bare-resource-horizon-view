
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StaffMemberCardProps } from './types';

export const StaffMemberCard: React.FC<StaffMemberCardProps & { onClick?: () => void }> = ({ 
  member, 
  colorScheme,
  onClick 
}) => {
  const getColorClasses = () => {
    switch (colorScheme) {
      case 'red':
        return {
          bg: 'bg-red-50 hover:bg-red-100',
          border: 'border-red-200',
          progress: 'bg-red-500',
          text: 'text-red-800'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50 hover:bg-blue-100',
          border: 'border-blue-200',
          progress: 'bg-blue-500',
          text: 'text-blue-800'
        };
      case 'green':
        return {
          bg: 'bg-green-50 hover:bg-green-100',
          border: 'border-green-200',
          progress: 'bg-green-500',
          text: 'text-green-800'
        };
      default:
        return {
          bg: 'bg-gray-50 hover:bg-gray-100',
          border: 'border-gray-200',
          progress: 'bg-gray-500',
          text: 'text-gray-800'
        };
    }
  };

  // Helper to get user initials
  const getUserInitials = (): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper to get avatar URL safely
  const getAvatarUrl = (): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  const colors = getColorClasses();

  return (
    <div 
      className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${colors.bg} ${colors.border}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={getAvatarUrl()} alt={member.name} />
          <AvatarFallback className="bg-[#6F4BF6] text-white text-xs">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-sm text-gray-800 truncate">
              {member.name}
            </span>
            <span className={`text-sm font-semibold ${colors.text}`}>
              {member.availability}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${colors.progress}`}
              style={{ width: `${Math.min(member.availability, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
