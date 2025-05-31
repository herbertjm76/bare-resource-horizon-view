
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface CompactInsightCardProps {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionLabel?: string;
  onAction?: () => void;
  metric?: string;
  icon?: React.ReactNode;
}

export const CompactInsightCard: React.FC<CompactInsightCardProps> = ({
  title,
  description,
  severity,
  actionLabel,
  onAction,
  metric,
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
      case 'critical': return <Badge variant="destructive" className="text-xs h-4 px-1">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500 text-white text-xs h-4 px-1">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-500 text-white text-xs h-4 px-1">Medium</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs h-4 px-1">Low</Badge>;
      default: return null;
    }
  };

  return (
    <Card className={`${getSeverityColor(severity)} border-l-4 transition-all hover:shadow-sm`}>
      <CardContent className="p-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {icon && (
              <div className="mt-0.5 flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm text-gray-900 truncate">{title}</h3>
                {getSeverityBadge(severity)}
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mb-1">{description}</p>
              {metric && (
                <div className="text-sm font-semibold text-gray-900 mb-1">{metric}</div>
              )}
              {actionLabel && onAction && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onAction}
                  className="text-xs h-5 px-2 flex items-center gap-1"
                >
                  {actionLabel}
                  <ArrowRight className="h-2 w-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
