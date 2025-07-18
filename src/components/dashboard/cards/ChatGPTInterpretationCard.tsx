import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { Loader2, Brain, Lightbulb, AlertTriangle, TrendingUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { typography } from '@/styles/typography';
import { ChatGPTService, SummaryInterpretation } from '@/services/chatGptService';
import { PreparedSummaryData } from '@/services/summaryDataPreparationService';

interface ChatGPTInterpretationCardProps {
  summaryData: PreparedSummaryData;
  title?: string;
  context?: string;
  autoGenerate?: boolean;
}

export function ChatGPTInterpretationCard({ 
  summaryData, 
  title = "AI Insights & Recommendations",
  context,
  autoGenerate = false
}: ChatGPTInterpretationCardProps) {
  const [loading, setLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<string>('');
  const [structuredData, setStructuredData] = useState<SummaryInterpretation | null>(null);
  const [error, setError] = useState<string>('');

  React.useEffect(() => {
    // ChatGPT features temporarily disabled for performance
    setInterpretation('AI interpretation features are temporarily disabled to improve dashboard performance. This feature will be re-enabled soon with performance optimizations.');
    setError('');
  }, [autoGenerate, summaryData]);

  const generateInterpretation = async () => {
    setError('AI interpretation features are temporarily disabled to improve dashboard performance. This feature will be re-enabled soon with performance optimizations.');
  };

  const getRiskVariant = (risk: string) => {
    if (risk.toLowerCase().includes('overload') || risk.toLowerCase().includes('burnout')) {
      return 'error';
    }
    if (risk.toLowerCase().includes('underutil')) {
      return 'warning';
    }
    return 'info';
  };

  const getOpportunityIcon = () => <Lightbulb className="h-4 w-4" />;
  const getRiskIcon = () => <AlertTriangle className="h-4 w-4" />;
  const getInsightIcon = () => <TrendingUp className="h-4 w-4" />;

  return (
    <Card className="w-full border-semantic-border-primary/50 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "flex items-center gap-3",
            typography.heading.h4.fontSize === '1.5rem' ? 'text-xl' : 'text-lg',
            "font-semibold text-semantic-text-primary"
          )}>
            <div className="p-2 rounded-xl bg-brand-violet/10 text-brand-violet">
              <Brain className="h-5 w-5" />
            </div>
            {title}
          </CardTitle>
          {!autoGenerate && (
            <Button
              onClick={generateInterpretation}
              disabled={loading}
              variant="outline"
              size="sm"
              className="hover:bg-brand-violet/5 hover:border-brand-violet/30 transition-colors"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-brand-violet" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
              {loading ? 'Analyzing...' : 'Generate Insights'}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-brand-violet mx-auto" />
              <p className="text-semantic-text-secondary font-medium">Generating AI interpretation...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200/50 bg-red-50/50 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {interpretation && structuredData && (
          <div className="space-y-8">
            {/* Key Insights */}
            {structuredData.insights.length > 0 && (
              <div className="space-y-4">
                <h4 className={cn(
                  "font-semibold flex items-center gap-3 text-semantic-text-primary",
                  typography.heading.h5.fontSize === '1.25rem' ? 'text-lg' : 'text-base'
                )}>
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                    {getInsightIcon()}
                  </div>
                  Key Insights
                </h4>
                <div className="grid gap-3">
                  {structuredData.insights.map((insight, index) => (
                    <div key={index} className="rounded-xl bg-semantic-background-accent/30 border border-brand-violet/20 p-4 hover:border-brand-violet/40 transition-colors">
                      <p className="text-semantic-text-primary leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {structuredData.recommendations.length > 0 && (
              <div className="space-y-4">
                <h4 className={cn(
                  "font-semibold flex items-center gap-3 text-semantic-text-primary",
                  typography.heading.h5.fontSize === '1.25rem' ? 'text-lg' : 'text-base'
                )}>
                  <div className="p-1.5 rounded-lg bg-green-100 text-green-600">
                    {getOpportunityIcon()}
                  </div>
                  Recommendations
                </h4>
                <div className="grid gap-3">
                  {structuredData.recommendations.map((recommendation, index) => (
                    <div key={index} className="rounded-xl bg-green-50/50 border border-green-200/60 p-4 hover:border-green-300/80 transition-colors">
                      <p className="text-semantic-text-primary leading-relaxed">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risks */}
            {structuredData.risks.length > 0 && (
              <div className="space-y-4">
                <h4 className={cn(
                  "font-semibold flex items-center gap-3 text-semantic-text-primary",
                  typography.heading.h5.fontSize === '1.25rem' ? 'text-lg' : 'text-base'
                )}>
                  <div className="p-1.5 rounded-lg bg-red-100 text-red-600">
                    {getRiskIcon()}
                  </div>
                  Risks to Monitor
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {structuredData.risks.map((risk, index) => (
                    <StandardizedBadge 
                      key={index} 
                      variant={getRiskVariant(risk)}
                      size="default"
                      className="transition-transform hover:scale-105"
                    >
                      {risk}
                    </StandardizedBadge>
                  ))}
                </div>
              </div>
            )}

            {/* Opportunities */}
            {structuredData.opportunities.length > 0 && (
              <div className="space-y-4">
                <h4 className={cn(
                  "font-semibold flex items-center gap-3 text-semantic-text-primary",
                  typography.heading.h5.fontSize === '1.25rem' ? 'text-lg' : 'text-base'
                )}>
                  <div className="p-1.5 rounded-lg bg-green-100 text-green-600">
                    {getOpportunityIcon()}
                  </div>
                  Opportunities
                </h4>
                <div className="grid gap-3">
                  {structuredData.opportunities.map((opportunity, index) => (
                    <div key={index} className="rounded-xl bg-green-50/50 border border-green-200/60 p-4 hover:border-green-300/80 transition-colors">
                      <p className="text-semantic-text-primary leading-relaxed">{opportunity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {interpretation && !structuredData?.insights.length && (
          <div className="rounded-xl bg-semantic-background-accent/30 border border-brand-violet/20 p-6">
            <p className="text-semantic-text-primary whitespace-pre-wrap leading-relaxed">{interpretation}</p>
          </div>
        )}

        {!interpretation && !loading && !error && (
          <div className="text-center py-12">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-muted/50 w-fit mx-auto">
                <Brain className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-semantic-text-primary">⚡ AI Features Temporarily Disabled</h3>
                <p className="text-semantic-text-secondary max-w-md mx-auto">
                  ChatGPT analysis is temporarily disabled for improved performance. This feature will be re-enabled soon.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}