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
}) => {
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';
  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'U';
  
  // Calculate progress for the ring
  const progress = Math.min((utilization / 100) * maxHours, maxHours);
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / maxHours) * circumference;
  
  // Determine color based on utilization
  const getUtilizationColor = () => {
    if (utilization > 100) return 'hsl(var(--destructive))';
    if (utilization >= 80) return 'hsl(var(--warning))';
    if (utilization >= 50) return 'hsl(var(--success))';
    return 'hsl(var(--primary))';
  };

  const getUtilizationBadgeVariant = () => {
    if (utilization > 100) return 'destructive';
    if (utilization >= 80) return 'warning';
    if (utilization >= 50) return 'default';
    return 'secondary';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="transition-all duration-200 hover:scale-110 cursor-pointer">
            {/* Avatar with utilization ring */}
            <div className="relative">
              <svg className="absolute inset-0 -rotate-90" width="52" height="52">
                <circle
                  cx="26"
                  cy="26"
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="3"
                />
                <circle
                  cx="26"
                  cy="26"
                  r={radius}
                  fill="none"
                  stroke={getUtilizationColor()}
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <Avatar className="h-11 w-11 m-0.5">
                <AvatarImage src={avatarUrl || ''} alt={fullName} />
                <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
              </Avatar>
            </div>
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
                <span className="font-medium">{availableHours}h this week</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Capacity:</span>
                <span className="font-medium">{maxHours}h/week</span>
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
