
import React from 'react';
import { Users, Briefcase, TrendingUp, Clock } from 'lucide-react';
import { StandardizedBadge } from "@/components/ui/standardized-badge";

interface MobileSummaryCardsProps {
  activeResources: number;
  activeProjects: number;
  utilizationRate: number;
  capacityHours?: number;
  isOverCapacity?: boolean;
  timeRangeText?: string;
}

export const MobileSummaryCards: React.FC<MobileSummaryCardsProps> = ({
  activeResources,
  activeProjects,
  utilizationRate,
  capacityHours = 0,
  isOverCapacity = false,
  timeRangeText = "This period"
}) => {
  const getUtilizationStatus = () => {
    if (utilizationRate >= 90) return { label: 'At Capacity', variant: 'error' as const };
    if (utilizationRate >= 75) return { label: 'High', variant: 'warning' as const };
    if (utilizationRate >= 50) return { label: 'Optimal', variant: 'success' as const };
    return { label: 'Low', variant: 'info' as const };
  };

  const utilizationStatus = getUtilizationStatus();

  const cards = [
    {
      title: 'Team Size',
      value: activeResources,
      icon: Users,
      badgeText: utilizationRate > 85 ? 'Consider Hiring' : 'Stable',
      badgeVariant: utilizationRate > 85 ? 'warning' as const : 'success' as const,
      subtitle: 'Active members'
    },
    {
      title: 'Projects',
      value: activeProjects,
      icon: Briefcase,
      badgeText: 'Active',
      badgeVariant: 'success' as const,
      subtitle: activeResources > 0 ? `${(activeProjects / activeResources).toFixed(1)} per person` : 'No team'
    },
    {
      title: 'Utilization',
      value: `${Math.round(utilizationRate)}%`,
      icon: TrendingUp,
      badgeText: utilizationStatus.label,
      badgeVariant: utilizationStatus.variant,
      subtitle: 'Team capacity used'
    },
    {
      title: isOverCapacity ? 'Over Capacity' : 'Available',
      value: `${Math.abs(capacityHours).toLocaleString()}h`,
      icon: Clock,
      badgeText: isOverCapacity ? 'Alert' : 'Available',
      badgeVariant: isOverCapacity ? 'error' as const : 'info' as const,
      subtitle: timeRangeText
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={index} 
            className="relative overflow-hidden rounded-xl bg-card border glass-card p-4 flex flex-col hover:shadow-lg transition-shadow"
          >
            {/* Header - fixed height */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-muted text-primary shrink-0">
                <IconComponent className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-semibold text-muted-foreground truncate tracking-wide uppercase">
                {card.title}
              </h3>
            </div>
            
            {/* Value section - flex grow */}
            <div className="flex-1 flex flex-col justify-center mb-3">
              <div className="text-2xl font-bold text-foreground tracking-tight">
                {card.value}
              </div>
            </div>
            
            {/* Footer - badge and subtitle aligned at bottom */}
            <div className="mt-auto space-y-1.5">
              <StandardizedBadge 
                variant={card.badgeVariant}
                size="metric"
                className="text-xs"
              >
                {card.badgeText}
              </StandardizedBadge>
              
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
