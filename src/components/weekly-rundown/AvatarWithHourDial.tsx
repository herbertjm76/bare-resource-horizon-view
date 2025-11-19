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

  const sizeClasses = {
    sm: { avatar: 'h-8 w-8', container: 'h-12 w-12', strokeWidth: 6 },
    md: { avatar: 'h-10 w-10', container: 'h-14 w-14', strokeWidth: 6 },
    lg: { avatar: 'h-12 w-12', container: 'h-16 w-16', strokeWidth: 6 }
  } as const;

  const sizes = sizeClasses[size];
  const strokeWidth = sizes.strokeWidth;
  const radius = 20; // fixed radius so the 6px ring sits fully inside the container
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${sizes.container} shrink-0`}>
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox="0 0 48 48"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={strokeWidth}
          opacity="0.3"
        />
        {/* Progress circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
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
