
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, Users, Target, ChevronRight } from 'lucide-react';
import { useIntelligentInsights } from '../intelligent-insights/hooks/useIntelligentInsights';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';
import { useIsMobile } from "@/hooks/use-mobile";

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  weekly_capacity?: number;
  job_title?: string;
}

interface UnifiedSmartInsightsCardProps {
  teamMembers: TeamMember[];
  activeProjects: number;
  utilizationRate: number;
}

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case 'critical': 
      return {
        card: 'bg-gradient-to-br from-red-50 via-red-50 to-red-100/80 border-red-200/60 hover:border-red-300/80',
        icon: 'bg-red-100 text-red-600',
        badge: 'bg-red-500/10 text-red-700 border-red-200'
      };
    case 'warning': 
      return {
        card: 'bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100/80 border-orange-200/60 hover:border-orange-300/80',
        icon: 'bg-orange-100 text-orange-600',
        badge: 'bg-orange-500/10 text-orange-700 border-orange-200'
      };
    case 'success': 
      return {
        card: 'bg-gradient-to-br from-green-50 via-green-50 to-green-100/80 border-green-200/60 hover:border-green-300/80',
        icon: 'bg-green-100 text-green-600',
        badge: 'bg-green-500/10 text-green-700 border-green-200'
      };
    case 'info': 
      return {
        card: 'bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100/80 border-blue-200/60 hover:border-blue-300/80',
        icon: 'bg-blue-100 text-blue-600',
        badge: 'bg-blue-500/10 text-blue-700 border-blue-200'
      };
    default: 
      return {
        card: 'bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100/80 border-gray-200/60 hover:border-gray-300/80',
        icon: 'bg-gray-100 text-gray-600',
        badge: 'bg-gray-500/10 text-gray-700 border-gray-200'
      };
  }
};

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    'trending-up': TrendingUp,
    'alert-triangle': AlertTriangle,
    'users': Users,
    'target': Target,
    'brain': Brain
  };
  return iconMap[iconName] || TrendingUp;
};

export const UnifiedSmartInsightsCard: React.FC<UnifiedSmartInsightsCardProps> = ({
  teamMembers,
  activeProjects,
  utilizationRate
}) => {
  const isMobile = useIsMobile();
  const { insights } = useIntelligentInsights({
    teamMembers,
    activeProjects,
    utilizationRate
  });

  // Use consistent mobile-style card design for both mobile and desktop
  const cardStyles = "rounded-2xl border-0 shadow-sm bg-white";
  const headerStyles = "pb-3 px-4";
  const titleStyles = "text-lg flex items-center gap-3";
  const contentStyles = "pt-0 px-4 pb-4";

  if (insights.length === 0) {
    return (
      <Card className={cardStyles}>
        <CardHeader className={headerStyles}>
          <CardTitle className={titleStyles}>
            <Brain className="h-5 w-5 text-brand-violet" strokeWidth={1.5} />
            <span className="text-brand-violet font-semibold">Smart Insights</span>
            <StandardizedHeaderBadge>AI-Powered</StandardizedHeaderBadge>
          </CardTitle>
        </CardHeader>
        <CardContent className={contentStyles}>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="p-4 rounded-full bg-brand-violet/10 mx-auto w-16 h-16 flex items-center justify-center">
                <Brain className="h-8 w-8 text-brand-violet" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Analyzing Your Team</h3>
                <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                  Our AI is gathering insights about your team's performance and capacity to provide actionable recommendations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cardStyles}>
      <CardHeader className={headerStyles}>
        <CardTitle className={titleStyles}>
          <Brain className="h-5 w-5 text-brand-violet" strokeWidth={1.5} />
          <span className="text-brand-violet font-semibold">Smart Insights</span>
          <StandardizedHeaderBadge>{insights.length} Active</StandardizedHeaderBadge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className={contentStyles}>
        <ScrollArea className={isMobile ? "h-full" : "h-[320px]"}>
          <div className="space-y-3">
            {insights.slice(0, 4).map((insight, index) => {
              const styles = getSeverityStyles(insight.severity);
              const IconComponent = getIconComponent(insight.icon?.name || 'brain');
              
              return (
                <div 
                  key={index} 
                  className={`group rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${styles.card}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 ${styles.icon}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                              {insight.title}
                            </h4>
                            <Badge variant="outline" className={`text-xs px-2 py-0.5 font-medium ${styles.badge}`}>
                              {insight.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {insight.description}
                          </p>
                        </div>
                        
                        {!isMobile && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700 flex-shrink-0"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      {insight.metric && (
                        <div className="bg-white/60 rounded-lg px-3 py-2 border border-white/40">
                          <p className="text-xs font-medium text-gray-800">
                            {insight.metric}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {insights.length > 4 && !isMobile && (
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-brand-violet hover:text-brand-violet hover:bg-brand-violet/5"
              >
                View {insights.length - 4} More Insights
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
