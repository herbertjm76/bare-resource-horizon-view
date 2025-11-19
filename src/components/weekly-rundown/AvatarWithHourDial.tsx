import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarWithHourDialProps {
  avatar?: string;
  fallback: string;
  hours: number;
  maxHours?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const AvatarWithHourDial: React.FC<AvatarWithHourDialProps> = ({
  avatar,
  fallback,
  hours,
  maxHours = 40,
  size = 'md',
  color = 'hsl(var(--primary))'
}) => {
  const percentage = Math.min((hours / maxHours) * 100, 100);
  const circumference = 2 * Math.PI * 18; // radius is 18
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizeClasses = {
    sm: { avatar: 'h-8 w-8', svg: 'h-12 w-12', strokeWidth: '3' },
    md: { avatar: 'h-10 w-10', svg: 'h-14 w-14', strokeWidth: '3' },
    lg: { avatar: 'h-12 w-12', svg: 'h-16 w-16', strokeWidth: '4' }
  };

  const sizes = sizeClasses[size];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className={`${sizes.svg} absolute -rotate-90`}>
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r="18"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={sizes.strokeWidth}
          opacity="0.3"
        />
        {/* Progress circle */}
        <circle
          cx="50%"
          cy="50%"
          r="18"
          fill="none"
          stroke={color}
          strokeWidth={sizes.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <Avatar className={`${sizes.avatar} ring-2 ring-background`}>
        <AvatarImage src={avatar} alt={fallback} />
        <AvatarFallback className="text-xs bg-gradient-modern text-white">
          {fallback}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};
