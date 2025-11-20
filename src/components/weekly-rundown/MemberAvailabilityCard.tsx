import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MemberAvailabilityCardProps {
  avatarUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  availableHours: number;
  utilization: number;
  department?: string | null;
  sectors: string[];
  maxHours?: number;
  threshold?: number;
}

export const MemberAvailabilityCard: React.FC<MemberAvailabilityCardProps> = ({
  avatarUrl,
  firstName,
  lastName,
  availableHours,
  utilization,
  department,
  sectors,
  maxHours = 40,
  threshold = 80,
}) => {
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';
  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'U';
  
  
  // Calculate progress for the ring based on utilization percentage
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(utilization, 100) / 100) * circumference;
  
  // Determine color based on utilization zones with actual HSL colors
  const getUtilizationColor = () => {
    if (utilization > 100) return 'hsl(0, 84%, 60%)'; // Red - overbooked
    if (utilization === 100) return 'hsl(142, 71%, 45%)'; // Green - fully booked
    if (utilization < 100 && utilization >= threshold) return 'hsl(38, 92%, 50%)'; // Amber - slightly available
    return 'hsl(221, 83%, 53%)'; // Blue - highly available
  };

  const getUtilizationBadgeVariant = () => {
    if (utilization > 100) return 'destructive'; // Red - overbooked
    if (utilization === 100) return 'default'; // Green - fully booked
    if (utilization < 100 && utilization >= threshold) return 'warning'; // Yellow - slightly available
    return 'secondary'; // Blue - highly available
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center transition-all duration-200 hover:scale-105 cursor-pointer">
            {/* Avatar with utilization ring */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Full light grey background circle */}
              <svg className="absolute inset-0 -rotate-90" width="48" height="48">
                <circle
                  cx="24"
                  cy="24"
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="6"
                />
                {/* Color-coded utilization ring */}
                <circle
                  cx="24"
                  cy="24"
                  r={radius}
                  fill="none"
                  stroke={getUtilizationColor()}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <Avatar className="h-7 w-7">
                <AvatarImage src={avatarUrl || ''} alt={fullName} />
                <AvatarFallback className="text-[10px] font-medium">{initials}</AvatarFallback>
              </Avatar>
            </div>
            
            {/* First name */}
            <span className="text-xs font-medium text-foreground truncate max-w-[50px] -mt-2">
              {firstName}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[250px]">
          <div className="space-y-2">
            <div>
              <p className="font-semibold">{fullName}</p>
              {department && <p className="text-xs text-muted-foreground">{department}</p>}
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Utilization:</span>
                <Badge variant={getUtilizationBadgeVariant()} className="text-[10px] h-5">
                  {Math.round(utilization)}%
                </Badge>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Available:</span>
                <span className="font-medium">{availableHours}h remaining</span>
              </div>
            </div>
            {sectors.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-1">Sectors:</p>
                <div className="flex flex-wrap gap-1">
                  {sectors.map((sector) => (
                    <Badge key={sector} variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
