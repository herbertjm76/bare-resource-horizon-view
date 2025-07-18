
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp, Calendar, Info, ChevronRight, Brain, DollarSign, Users, Target, RefreshCw, UserX, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';
import { UnifiedDashboardData } from '../hooks/useDashboardData';
import { AdvancedInsightsService, AdvancedInsight } from '@/services/advancedInsightsService';
import { AIInsightsService, AIInsight } from '@/services/aiInsightsService';
import { useCompany } from '@/context/CompanyContext';

interface UnifiedSmartInsightsCardProps {
  data: UnifiedDashboardData;
}

// Enhanced priority system with more nuanced colors
const getPriorityConfig = (type: string, priority: string) => {
  const configs = {
    critical: {
      color: 'bg-red-100 text-red-800 border-red-200',
      bgColor: 'bg-red-100 text-red-600',
      cardBg: 'bg-gradient-to-br from-red-50 via-red-50 to-red-100/80 border-red-200/60 hover:border-red-300/80',
      icon: AlertTriangle
    },
    warning: {
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      bgColor: 'bg-orange-100 text-orange-600',
      cardBg: 'bg-gradient-to-br from-orange-50 via-orange-50 to-orange-100/80 border-orange-200/60 hover:border-orange-300/80',
      icon: TrendingUp
    },
    opportunity: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      bgColor: 'bg-blue-100 text-blue-600',
      cardBg: 'bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100/80 border-blue-200/60 hover:border-blue-300/80',
      icon: Target
    },
    success: {
      color: 'bg-green-100 text-green-800 border-green-200',
      bgColor: 'bg-green-100 text-green-600',
      cardBg: 'bg-gradient-to-br from-green-50 via-green-50 to-green-100/80 border-green-200/60 hover:border-green-300/80',
      icon: CheckCircle
    },
    trend: {
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      bgColor: 'bg-purple-100 text-purple-600',
      cardBg: 'bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100/80 border-purple-200/60 hover:border-purple-300/80',
      icon: TrendingUp
    }
  };
  
  return configs[type as keyof typeof configs] || configs.success;
};

// Enhanced icon mapping for different insight types
const getInsightIcon = (iconName: string) => {
  const iconMap = {
    'alert-triangle': AlertTriangle,
    'check-circle': CheckCircle,
    'trending-up': TrendingUp,
    'trending-down': TrendingUp,
    'calendar': Calendar,
    'brain': Brain,
    'dollar-sign': DollarSign,
    'users': Users,
    'target': Target,
    'refresh-cw': RefreshCw,
    'user-x': UserX,
    'balance-scale': Users, // Using Users as placeholder for balance
    'info': Info
  };
  
  return iconMap[iconName as keyof typeof iconMap] || Info;
};

const getTimeframeColor = (timeframe: string) => {
  switch (timeframe) {
    case 'immediate': return 'bg-red-500';
    case 'short-term': return 'bg-orange-500';
    case 'medium-term': return 'bg-blue-500';
    case 'long-term': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getCategoryEmoji = (category: string) => {
  const emojis = {
    capacity: '⚡',
    efficiency: '🎯',
    risk: '⚠️',
    growth: '📈',
    financial: '💰',
    team: '👥'
  };
  return emojis[category as keyof typeof emojis] || '📊';
};

export const UnifiedSmartInsightsCard: React.FC<UnifiedSmartInsightsCardProps> = ({ data }) => {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useAI, setUseAI] = useState(true);
  const { company } = useCompany();
  
  // AI insights temporarily disabled for performance
  useEffect(() => {
    setUseAI(false);
    setIsLoading(false);
    console.log('⚡ AI insights temporarily disabled for performance');
  }, [company?.id]);

  // Use AI insights if available, otherwise fall back to advanced insights
  const insights = useAI && aiInsights.length > 0 ? aiInsights : AdvancedInsightsService.generateAdvancedInsights(data);
  
  // Count insights by priority for header badge
  const highPriorityInsights = insights.filter(i => i.priority === 'critical' || i.priority === 'warning').length;
  const criticalInsights = insights.filter(i => i.priority === 'critical').length;

  const toggleInsightExpansion = (insightId: string) => {
    setExpandedInsight(expandedInsight === insightId ? null : insightId);
  };

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
        <CardContent className="p-3 sm:p-6 h-full flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-brand-violet/10 mx-auto w-16 h-16 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-brand-violet animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Analyzing Team Performance</h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                Our AI is processing your team data to generate actionable insights and recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
        <CardContent className="p-3 sm:p-6 h-full flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-brand-violet/10 mx-auto w-16 h-16 flex items-center justify-center">
              <Brain className="h-8 w-8 text-brand-violet" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">No Insights Available</h3>
              <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                Add team members and projects to generate insights about your team's performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-brand-violet to-purple-600">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            Smart Insights
          </h2>
          <StandardizedHeaderBadge>
            {criticalInsights > 0 ? `${criticalInsights} Critical` : 
             highPriorityInsights > 0 ? `${highPriorityInsights} High Priority` : 
             `${insights.length} Insights`}
          </StandardizedHeaderBadge>
        </div>
        
        {/* Scrollable insights content */}
        <ScrollArea className="flex-1">
          <div className="pr-4 space-y-3">
            {insights.map((insight, index) => {
              const priorityConfig = getPriorityConfig(insight.type, insight.priority);
              const IconComponent = getInsightIcon(insight.icon);
              const isExpanded = expandedInsight === (insight.id || `insight-${index}`);
              
              return (
                <div 
                  key={insight.id || `insight-${index}`} 
                  className={`group rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-lg cursor-pointer ${priorityConfig.cardBg}`}
                  onClick={() => toggleInsightExpansion(insight.id || `insight-${index}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 ${priorityConfig.bgColor}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-lg">{getCategoryEmoji(insight.category)}</span>
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                              {insight.title}
                            </h4>
                            <Badge variant="outline" className={`text-xs px-2 py-0.5 font-medium ${priorityConfig.color}`}>
                              {insight.priority}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${getTimeframeColor(insight.timeframe)}`}></div>
                              <span className="text-xs text-gray-500 capitalize">{insight.timeframe}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed mb-2">
                            {insight.description}
                          </p>
                          
                           {/* Metric Badge - only show if metric exists */}
                           {(insight as any).metric && (
                             <div className="bg-white/60 rounded-lg px-3 py-2 border border-white/40 mb-2">
                               <p className="text-xs font-medium text-gray-800">
                                 📊 {(insight as any).metric}
                               </p>
                             </div>
                           )}
                          
                          {/* Expandable content */}
                          {isExpanded && (
                            <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
                              <div className="bg-white/80 rounded-lg p-3 border border-white/60">
                                <h5 className="font-medium text-gray-900 text-xs mb-1">💥 IMPACT</h5>
                                <p className="text-xs text-gray-700 leading-relaxed">{insight.impact}</p>
                              </div>
                              
                              <div className="bg-white/80 rounded-lg p-3 border border-white/60">
                                <h5 className="font-medium text-gray-900 text-xs mb-1">🎯 RECOMMENDATION</h5>
                                <p className="text-xs text-gray-700 leading-relaxed">{insight.recommendation}</p>
                              </div>
                              
                               <div className="flex items-center justify-between text-xs text-gray-500">
                                 <span>Confidence: {typeof insight.confidence === 'number' && insight.confidence <= 1 ? Math.round(insight.confidence * 100) : insight.confidence}%</span>
                                 <span className="capitalize">{insight.timeframe} action needed</span>
                               </div>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700 flex-shrink-0"
                        >
                          <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
