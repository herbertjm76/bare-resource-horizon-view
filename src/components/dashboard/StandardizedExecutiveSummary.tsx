
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
  console.log('StandardizedExecutiveSummary render (unified desktop/mobile format)');

  const getIconColor = () => {
    // Always use brand-violet for consistency across all executive summary cards
    return 'text-brand-violet bg-brand-violet/10';
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
    if (title.includes('leave') || title.includes('holiday') || title.includes('annual')) return Calendar; // Match sidebar "Team Annual Leave"
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
        return 'bg-gradient-to-br from-blue-50/80 via-cyan-50/60 to-blue-50/80';
      case 'emerald':
        return 'bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-emerald-50/80';
      case 'violet':
        return 'bg-gradient-to-br from-violet-50/80 via-purple-50/60 to-violet-50/80';
      default:
        return 'bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-indigo-50/80 backdrop-blur-sm';
    }
  };

  console.log('Rendering enhanced unified desktop/mobile format with improved visual hierarchy');
  return (
    <div className={cn(
      "w-[90%] sm:w-full mx-auto rounded-xl p-3 sm:p-4 border shadow-sm animate-in",
      getGradientClasses(),
      "border-semantic-border-primary/50"
    )}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric, index) => {
          const { badge, subtitle } = getDefaultBadgeAndSubtitle(metric, index);
          const IconComponent = getStandardIcon(metric, index);
          
          return (
            <div key={index} className="min-w-0">
              <Card className="bg-semantic-background-primary border border-semantic-border-primary/50 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-brand-violet/30 h-full shadow-sm group">
                <CardContent className="p-3 sm:p-4">
                  {/* Header: Icon + Title with improved spacing */}
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className={cn(
                      "p-2 rounded-xl flex-shrink-0 transition-colors duration-200",
                      "bg-brand-violet/10 text-brand-violet group-hover:bg-brand-violet/15"
                    )}>
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn(
                        "font-medium text-semantic-text-primary leading-tight truncate",
                        typography.ui.label.fontSize === '0.875rem' ? 'text-sm' : 'text-xs'
                      )}>
                        {metric.title}
                      </h4>
                    </div>
                  </div>
                  
                  {/* Main Value with enhanced typography hierarchy */}
                  <div className="mb-3">
                    <div className={cn(
                      "font-bold text-semantic-text-primary leading-none mb-1",
                      "text-2xl sm:text-3xl lg:text-2xl xl:text-3xl", // Responsive larger sizes
                      "bg-gradient-to-br from-semantic-text-primary to-semantic-text-secondary bg-clip-text"
                    )}>
                      {metric.value}
                    </div>
                    <StandardizedBadge 
                      variant={getBadgeVariant(badge.color, metric.isGood)}
                      size="metric"
                      className="mt-2"
                    >
                      {badge.text}
                    </StandardizedBadge>
                  </div>
                  
                  {/* Subtitle with improved typography */}
                  <p className={cn(
                    "text-semantic-text-secondary leading-relaxed",
                    typography.body.small.fontSize === '0.875rem' ? 'text-sm' : 'text-xs'
                  )}>
                    {subtitle}
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
