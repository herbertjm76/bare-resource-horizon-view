
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { Users, Briefcase, TrendingUp, Clock, UserSquare2, FolderKanban, Calendar, GanttChartSquare } from 'lucide-react';
import { typography } from '@/styles/typography';
import { cn } from '@/lib/utils';

interface SummaryMetric {
  title: string;
  value: string | number | React.ReactNode;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: string;
  isGood?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

type GradientType = 'purple' | 'blue' | 'emerald' | 'violet';

interface StandardizedExecutiveSummaryProps {
  title?: string;
  timeRangeText?: string;
  metrics: SummaryMetric[];
  gradientType?: GradientType;
  cardOpacity?: number;
  badgePosition?: 'title' | 'value'; // New prop to control badge positioning
}

export const StandardizedExecutiveSummary: React.FC<StandardizedExecutiveSummaryProps> = ({
  metrics,
  gradientType = 'purple',
  cardOpacity = 0.9,
  badgePosition = 'title'
}) => {
  const getIconColor = () => {
    // Always use theme-primary for consistency across all executive summary cards
    return 'text-theme-primary bg-theme-primary/10';
  };

  const getBadgeVariant = (badgeColor?: string, isGood?: boolean) => {
    // Use semantic variants for good/bad states
    if (isGood === true) return 'success';
    if (isGood === false) return 'error';
    
    // Map color strings to semantic variants
    switch (badgeColor?.toLowerCase()) {
      case 'green': return 'success';
      case 'red': return 'error';
      case 'orange': case 'yellow': return 'warning';
      case 'blue': return 'info';
      case 'violet': case 'purple': return 'primary';
      default: return 'metric'; // Use the new metric variant for better visual hierarchy
    }
  };

  // Consistent icon mapping based on sidebar icons and content relevance
  const getStandardIcon = (metric: SummaryMetric, index: number) => {
    if (metric.icon) return metric.icon;
    
    const title = metric.title.toLowerCase();
    
    // Match icons to sidebar navigation and content
    if (title.includes('utilization') || title.includes('performance') || title.includes('rate')) return TrendingUp;
    if (title.includes('capacity') || title.includes('hours') || title.includes('time') || title.includes('available')) return Clock;
    if (title.includes('projects') || title.includes('project') || title.includes('active projects')) return FolderKanban; // Match sidebar "All Projects"
    if (title.includes('team') || title.includes('members') || title.includes('size') || title.includes('resources') || title.includes('staff')) return UserSquare2; // Match sidebar "Team Members"
    if (title.includes('resourcing') || title.includes('allocation')) return GanttChartSquare; // Match sidebar "Project Resourcing"
    if (title.includes('workload') || title.includes('overloaded') || title.includes('needs')) return Briefcase; // Match sidebar "Team Workload"
    if (title.includes('leave') || title.includes('holiday') || title.includes('annual')) return Calendar; // Match sidebar "Team Leave"
    if (title.includes('completion') || title.includes('office') || title.includes('location')) return Users; // Generic fallback
    
    // Default icons based on position if no match - prioritize most common metrics
    const defaultIcons = [TrendingUp, Clock, FolderKanban, UserSquare2];
    return defaultIcons[index % defaultIcons.length];
  };

  // Generate default badge and subtitle for cards that don't have them
  function getDefaultBadgeAndSubtitle(metric: SummaryMetric, index: number) {
    const title = metric.title.toLowerCase();
    
    // Return existing badge/subtitle if provided
    if (metric.badgeText && metric.subtitle) {
      return { 
        badge: { text: metric.badgeText, color: metric.badgeColor },
        subtitle: metric.subtitle
      };
    }
    
    // Generate contextual badges and subtitles based on metric title
    if (title.includes('utilization')) {
      const numericValue = typeof metric.value === 'number' ? metric.value : 
                          typeof metric.value === 'string' ? parseInt(metric.value) : null;
      
      if (numericValue !== null) {
        if (numericValue > 85) return { 
          badge: { text: 'High', color: 'orange' },
          subtitle: 'Above optimal range'
        };
        if (numericValue > 70) return { 
          badge: { text: 'Optimal', color: 'green' },
          subtitle: 'Healthy utilization'
        };
        return { 
          badge: { text: 'Low', color: 'blue' },
          subtitle: 'Room for more projects'
        };
      }
      return { 
        badge: { text: 'Active', color: 'blue' },
        subtitle: 'Team utilization tracking'
      };
    }
    
    if (title.includes('capacity') || title.includes('hours')) {
      return { 
        badge: { text: 'Available', color: 'blue' },
        subtitle: metric.subtitle || 'Resource capacity'
      };
    }
    
    if (title.includes('projects')) {
      return { 
        badge: { text: 'Active', color: 'green' },
        subtitle: metric.subtitle || 'Current portfolio'
      };
    }
    
    if (title.includes('team') || title.includes('members') || title.includes('size')) {
      return { 
        badge: { text: 'Stable', color: 'green' },
        subtitle: metric.subtitle || 'Team composition'
      };
    }
    
    if (title.includes('offices') || title.includes('locations')) {
      return { 
        badge: { text: 'Multi-Site', color: 'blue' },
        subtitle: metric.subtitle || 'Geographic presence'
      };
    }
    
    if (title.includes('completion') || title.includes('rate')) {
      return { 
        badge: { text: 'On Track', color: 'green' },
        subtitle: metric.subtitle || 'Progress tracking'
      };
    }

    if (title.includes('resourcing')) {
      return { 
        badge: { text: 'Review', color: 'orange' },
        subtitle: metric.subtitle || 'Needs attention'
      };
    }

    if (title.includes('overloaded') || title.includes('over capacity')) {
      return { 
        badge: { text: 'Alert', color: 'red' },
        subtitle: metric.subtitle || 'Capacity exceeded'
      };
    }
    
    // Default fallback
    return { 
      badge: { text: 'Active', color: 'blue' },
      subtitle: metric.subtitle || 'Current status'
    };
  };

  const getGradientClasses = () => {
    switch (gradientType) {
      case 'blue':
        return 'bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600';
      case 'emerald':
        return 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600';
      case 'violet':
        return 'bg-gradient-to-br from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))]';
      default:
        return 'bg-gradient-to-br from-[hsl(var(--gradient-start))] via-[hsl(var(--gradient-mid))] to-[hsl(var(--gradient-end))]';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const { badge, subtitle } = getDefaultBadgeAndSubtitle(metric, index);
        const IconComponent = getStandardIcon(metric, index);
        
        // Check if value is a React element (like Gauge) vs simple value
        const isComplexValue = React.isValidElement(metric.value);
        
        return (
          <div key={index} className="relative overflow-hidden rounded-xl bg-card border glass-card p-4 flex flex-col hover:shadow-lg transition-shadow">
            {/* Header - fixed height */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <IconComponent className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-semibold text-muted-foreground truncate tracking-wide uppercase">
                {metric.title}
              </h3>
            </div>
            
            {/* Value section - flex grow to push footer down */}
            <div className="flex-1 flex flex-col justify-center mb-3">
              {isComplexValue ? (
                <div className="flex justify-center">
                  {metric.value}
                </div>
              ) : (
                <div className="text-2xl font-bold text-foreground tracking-tight">
                  {metric.value}
                </div>
              )}
            </div>
            
            {/* Footer - badge and subtitle aligned at bottom */}
            <div className="mt-auto space-y-1.5">
              <StandardizedBadge 
                variant={getBadgeVariant(badge.color, metric.isGood)}
                size="metric"
                className="text-xs"
              >
                {badge.text}
              </StandardizedBadge>
              
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
