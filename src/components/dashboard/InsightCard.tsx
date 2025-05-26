
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Users, Target, ArrowRight } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionLabel?: string;
  onAction?: () => void;
  metric?: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  severity,
  actionLabel,
  onAction,
  metric,
  trend,
  icon
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500 text-white">High Priority</Badge>;
      case 'medium': return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
      case 'low': return <Badge variant="secondary">Low Priority</Badge>;
      default: return null;
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
    return null;
  };

  return (
    <Card className={`${getSeverityColor(severity)} border-l-4 transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {icon && (
              <div className="mt-1">
                {icon}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {getSeverityBadge(severity)}
              </div>
              <p className="text-sm text-gray-700 mb-3">{description}</p>
              {metric && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">{metric}</span>
                  {getTrendIcon()}
                </div>
              )}
              {actionLabel && onAction && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onAction}
                  className="flex items-center gap-2"
                >
                  {actionLabel}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
