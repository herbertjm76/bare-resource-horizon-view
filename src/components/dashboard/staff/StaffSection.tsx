
import React from 'react';
import { StaffSectionProps } from './types';
import { StaffMemberCard } from './StaffMemberCard';

export const StaffSection: React.FC<StaffSectionProps> = ({ 
  title, 
  icon, 
  members, 
  colorScheme, 
  showLimit,
  subtitle 
}) => {
  if (members.length === 0) return null;

  const displayMembers = showLimit ? members.slice(0, showLimit) : members;
  const remainingCount = showLimit && members.length > showLimit ? members.length - showLimit : 0;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className={`font-semibold ${colorScheme === 'red' ? 'text-red-700' : colorScheme === 'blue' ? 'text-blue-700' : 'text-green-700'}`}>
          {title} ({members.length})
          {subtitle && (
            <span className="text-xs font-normal text-gray-500 ml-1">
              {subtitle}
            </span>
          )}
        </h4>
      </div>
      <div className="space-y-3">
        {displayMembers.map((member, index) => (
          <StaffMemberCard 
            key={index} 
            member={member} 
            colorScheme={colorScheme}
          />
        ))}
        {remainingCount > 0 && (
          <p className="text-xs text-gray-500 text-center">
            +{remainingCount} more available
          </p>
        )}
      </div>
    </div>
  );
};
