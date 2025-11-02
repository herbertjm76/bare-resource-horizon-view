
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, Users, Target, ChevronRight, Loader2 } from 'lucide-react';
import { useIntelligentInsights } from './intelligent-insights/hooks/useIntelligentInsights';
import { AIInsightsService, AIInsight } from '@/services/aiInsightsService';
import { useCompany } from '@/context/CompanyContext';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  weekly_capacity?: number;
  job_title?: string;
}

interface IntelligentInsightsProps {
  teamMembers: TeamMember[];
  activeProjects: number;
  utilizationRate: number;
}

const getSeverityStyles = (priority: string) => {
  switch (priority) {
    case 'critical': 
      return {
        card: 'bg-white border-red-200 hover:border-red-300 hover:shadow-md',
        icon: 'bg-red-50 text-red-600',
        badge: 'bg-red-50 text-red-700 border-red-200'
      };
    case 'warning': 
      return {
        card: 'bg-white border-orange-200 hover:border-orange-300 hover:shadow-md',
        icon: 'bg-orange-50 text-orange-600',
        badge: 'bg-orange-50 text-orange-700 border-orange-200'
      };
    case 'success': 
      return {
        card: 'bg-white border-green-200 hover:border-green-300 hover:shadow-md',
        icon: 'bg-green-50 text-green-600',
        badge: 'bg-green-50 text-green-700 border-green-200'
      };
    case 'opportunity':
    case 'info': 
      return {
        card: 'bg-white border-blue-200 hover:border-blue-300 hover:shadow-md',
        icon: 'bg-blue-50 text-blue-600',
        badge: 'bg-blue-50 text-blue-700 border-blue-200'
      };
    default: 
      return {
        card: 'bg-white border-border hover:border-gray-300 hover:shadow-md',
        icon: 'bg-muted text-muted-foreground',
        badge: 'bg-muted text-foreground border-border'
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

export const IntelligentInsights: React.FC<IntelligentInsightsProps> = ({
  teamMembers,
  activeProjects,
  utilizationRate
}) => {
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useAI, setUseAI] = useState(true);
  const { company } = useCompany();
  
  // Fallback insights using existing hook
  const { insights: fallbackInsights } = useIntelligentInsights({
    teamMembers,
    activeProjects,
    utilizationRate
  });

  // Load AI insights
  useEffect(() => {
    const loadAIInsights = async () => {
      if (!company?.id || !useAI) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await AIInsightsService.generateInsights(company.id, '30d');
        
        if (response.success && response.insights.length > 0) {
          setAiInsights(response.insights);
        } else {
          console.log('AI insights failed, falling back to local insights');
          setUseAI(false);
        }
      } catch (error) {
        console.error('Error loading AI insights:', error);
        setUseAI(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadAIInsights();
  }, [company?.id, useAI]);

  // Use AI insights if available, otherwise fall back to local insights
  const insights = useAI && aiInsights.length > 0 ? aiInsights : fallbackInsights;

  if (isLoading) {
    return (
      <Card className="h-[400px] flex flex-col bg-white border-border shadow-sm">
        <CardHeader className="flex-shrink-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-violet/10">
              <Loader2 className="h-5 w-5 text-brand-violet animate-spin" />
            </div>
            <span className="text-brand-violet font-semibold">
              Smart Insights
            </span>
            <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-brand-violet/10 mx-auto w-16 h-16 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-brand-violet animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Analyzing Your Team</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Processing your team data to generate actionable insights.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="h-[400px] flex flex-col bg-white border-border shadow-sm">
        <CardHeader className="flex-shrink-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-violet/10">
              <Brain className="h-5 w-5 text-brand-violet" />
            </div>
            <span className="text-brand-violet font-semibold">
              Smart Insights
            </span>
            <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-brand-violet/10 mx-auto w-16 h-16 flex items-center justify-center">
              <Brain className="h-8 w-8 text-brand-violet" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Analyzing Your Team</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Gathering insights about your team's performance and capacity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[400px] flex flex-col bg-white border-border shadow-sm">
      <CardHeader className="flex-shrink-0 pb-4">
        <CardTitle className="text-lg flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-violet/10">
            <Brain className="h-5 w-5 text-brand-violet" />
          </div>
          <span className="text-brand-violet font-semibold">
            Smart Insights
          </span>
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
            {insights.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-3 px-6 pb-6">
            {insights.slice(0, 4).map((insight, index) => {
              // Handle both AI insights and fallback insights
              const priority = (insight as any).priority || (insight as any).severity;
              const iconName = typeof (insight as any).icon === 'string' ? (insight as any).icon : (insight as any).icon?.name || 'brain';
              const styles = getSeverityStyles(priority);
              const IconComponent = getIconComponent(iconName);
              
              return (
                <div 
                  key={index} 
                  className={`group rounded-lg border p-4 transition-all duration-200 ${styles.card}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${styles.icon}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-foreground text-sm leading-tight">
                          {insight.title}
                        </h4>
                        <Badge variant="outline" className={`text-xs px-2 py-0.5 ${styles.badge}`}>
                          {insight.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                      
                      {insight.metric && (
                        <div className="mt-3 bg-muted/50 rounded px-3 py-1.5 border border-border">
                          <p className="text-xs font-medium text-foreground">
                            {insight.metric}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {insights.length > 4 && (
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
