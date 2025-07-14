import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, Lightbulb, AlertTriangle, TrendingUp, MessageSquare } from 'lucide-react';
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
    if (autoGenerate && summaryData) {
      generateInterpretation();
    }
  }, [autoGenerate, summaryData]);

  const generateInterpretation = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await ChatGPTService.interpretSummaryData(summaryData, context);
      
      if (response.success) {
        setInterpretation(response.content);
        const parsed = ChatGPTService.parseStructuredResponse(response.content);
        setStructuredData(parsed);
      } else {
        setError(response.error || 'Failed to generate interpretation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    if (risk.toLowerCase().includes('overload') || risk.toLowerCase().includes('burnout')) {
      return 'destructive';
    }
    if (risk.toLowerCase().includes('underutil')) {
      return 'secondary';
    }
    return 'default';
  };

  const getOpportunityIcon = () => <Lightbulb className="h-4 w-4" />;
  const getRiskIcon = () => <AlertTriangle className="h-4 w-4" />;
  const getInsightIcon = () => <TrendingUp className="h-4 w-4" />;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          {!autoGenerate && (
            <Button
              onClick={generateInterpretation}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
              {loading ? 'Analyzing...' : 'Generate Insights'}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Generating AI interpretation...</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {interpretation && structuredData && (
          <div className="space-y-6">
            {/* Key Insights */}
            {structuredData.insights.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  {getInsightIcon()}
                  Key Insights
                </h4>
                <div className="space-y-2">
                  {structuredData.insights.map((insight, index) => (
                    <div key={index} className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {structuredData.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  {getOpportunityIcon()}
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {structuredData.recommendations.map((recommendation, index) => (
                    <div key={index} className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risks */}
            {structuredData.risks.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  {getRiskIcon()}
                  Risks to Monitor
                </h4>
                <div className="flex flex-wrap gap-2">
                  {structuredData.risks.map((risk, index) => (
                    <Badge 
                      key={index} 
                      variant={getRiskColor(risk)}
                      className="text-xs"
                    >
                      {risk}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Opportunities */}
            {structuredData.opportunities.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  {getOpportunityIcon()}
                  Opportunities
                </h4>
                <div className="space-y-2">
                  {structuredData.opportunities.map((opportunity, index) => (
                    <div key={index} className="rounded-lg bg-success/5 border border-success/20 p-3">
                      <p className="text-sm text-success-foreground">{opportunity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {interpretation && !structuredData?.insights.length && (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm whitespace-pre-wrap">{interpretation}</p>
          </div>
        )}

        {!interpretation && !loading && !error && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Click "Generate Insights" to get AI-powered analysis of your workload data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}