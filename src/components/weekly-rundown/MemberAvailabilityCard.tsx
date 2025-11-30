import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProjectAllocation } from '@/types/weekly-overview';

interface MemberAvailabilityCardProps {
  avatarUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  allocatedHours: number;
  projectAllocations: ProjectAllocation[];
  utilization: number;
  threshold?: number;
  memberId: string;
  memberType: 'active' | 'pre_registered';
  weekStartDate: string;
}

export const MemberAvailabilityCard: React.FC<MemberAvailabilityCardProps> = ({
  avatarUrl,
  firstName,
  lastName,
  allocatedHours,
  projectAllocations,
  utilization,
  threshold = 80,
  memberId,
  memberType,
  weekStartDate,
}) => {
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';
  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'U';
  
  
  // Calculate progress for the ring based on utilization percentage
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(utilization, 100) / 100) * circumference;
  
  // Determine color based on utilization zones using semantic tokens
  const getUtilizationColor = () => {
    if (utilization > 100) return 'hsl(var(--status-error))'; // Over-allocated
    if (utilization === 100) return 'hsl(var(--status-success))'; // At capacity
    if (utilization < 100 && utilization >= threshold) return 'hsl(var(--status-warning))'; // Near capacity
    return 'hsl(var(--status-info))'; // Available
  };
  return (
    <div 
      className="flex flex-col items-center transition-all duration-200 hover:scale-105 cursor-pointer"
    >
      {/* Avatar with utilization ring */}
      <div className="relative w-[50px] h-[50px] flex items-center justify-center">
        {/* Full light grey background circle */}
        <svg className="absolute inset-0 -rotate-90" width="50" height="50">
          <circle
            cx="25"
            cy="25"
            r={20}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="5"
          />
          {/* Color-coded utilization ring */}
          <circle
            cx="25"
            cy="25"
            r={20}
            fill="none"
            stroke={getUtilizationColor()}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <Avatar className="h-[38px] w-[38px]">
          <AvatarImage src={avatarUrl || ''} alt={fullName} />
          <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
        </Avatar>
      </div>
      
      {/* First name */}
      <span className="text-[11px] font-medium text-foreground truncate max-w-[55px] -mt-1">
        {firstName}
      </span>
    </div>
  );
};
