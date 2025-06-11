
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Users, Briefcase, TrendingUp, Clock, UserSquare2, FolderKanban, Calendar, GanttChartSquare } from 'lucide-react';

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

  const getBadgeStyle = (badgeColor?: string, isGood?: boolean) => {
    // Use indicator color for good/bad
    if (isGood === true) return 'bg-green-500 text-white border-green-400';
    if (isGood === false) return 'bg-red-500 text-white border-red-400';
    
    // Fallback to badge color
    switch (badgeColor) {
      case 'green': return 'bg-green-500 text-white border-green-400';
      case 'red': return 'bg-red-500 text-white border-red-400';
      case 'orange': return 'bg-orange-500 text-white border-orange-400';
      case 'blue': return 'bg-blue-500 text-white border-blue-400';
      case 'yellow': return 'bg-yellow-500 text-white border-yellow-400';
      default: return 'bg-brand-violet text-white border-brand-violet';
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
        return 'bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50';
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50';
      case 'violet':
        return 'bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50';
      default:
        return 'bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50';
    }
  };

  console.log('Rendering unified desktop/mobile format');
  return (
    <div className={`w-[90%] sm:w-full mx-auto ${getGradientClasses()} rounded-xl p-2 sm:p-3 border border-purple-100/50 shadow-sm`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2">
        {metrics.map((metric, index) => {
          const { badge, subtitle } = getDefaultBadgeAndSubtitle(metric, index);
          const IconComponent = getStandardIcon(metric, index);
          
          return (
            <div key={index} className="min-w-0">
              <Card className="bg-white border border-gray-100 rounded-md sm:rounded-lg transition-all duration-300 hover:shadow-md h-full shadow-sm">
                <CardContent className="p-1.5 sm:p-2">
                  {/* Line 1: Icon + Title */}
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 mb-1">
                    <div className={`p-0.5 sm:p-1 rounded-full ${getIconColor()} flex-shrink-0`}>
                      <IconComponent className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </div>
                    <Typography variant="body-sm" className="font-medium text-gray-700 text-xs leading-tight truncate">
                      {metric.title}
                    </Typography>
                  </div>
                  
                  {/* Line 2: Value (left) and Badge (right) */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-base sm:text-lg font-bold text-gray-900 leading-none">
                      {metric.value}
                    </div>
                    <Badge className={`text-xs px-1 py-0.5 h-3.5 ml-1 flex-shrink-0 ${getBadgeStyle(badge.color, metric.isGood)}`}>
                      {badge.text}
                    </Badge>
                  </div>
                  
                  {/* Line 3: Subtitle (left) */}
                  <p className="text-xs text-gray-500 leading-tight">
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
