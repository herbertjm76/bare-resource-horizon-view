
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Calendar, Plane } from 'lucide-react';

interface IconConfig {
  name: string;
  className: string;
}

interface CompactInsightCardProps {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionLabel?: string;
  onAction?: () => void;
  metric?: string;
  icon: IconConfig | React.ReactNode;
}

const iconMap = {
  'trending-up': TrendingUp,
  'alert-triangle': AlertTriangle,
  'calendar': Calendar,
  'plane': Plane,
  'target': TrendingUp, // fallback
  'briefcase': TrendingUp, // fallback
  'users': TrendingUp, // fallback
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-50 border-red-200 text-red-800';
    case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
    case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'low': return 'bg-green-50 border-green-200 text-green-800';
    default: return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

export const CompactInsightCard: React.FC<CompactInsightCardProps> = ({
  title,
  description,
  severity,
  actionLabel,
  onAction,
  metric,
  icon
}) => {
  const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    if (typeof icon === 'object' && icon.name) {
      const IconComponent = iconMap[icon.name as keyof typeof iconMap] || TrendingUp;
      return <IconComponent className={icon.className} />;
    }
    
    return <TrendingUp className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card className={`border-l-4 ${getSeverityColor(severity)} transition-all hover:shadow-md`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-0.5">
              {renderIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm text-gray-900 truncate">{title}</h4>
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  {severity}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{description}</p>
              {metric && (
                <p className="text-xs font-medium text-gray-800">{metric}</p>
              )}
            </div>
          </div>
          {actionLabel && onAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAction}
              className="ml-2 text-xs h-7 px-2 flex-shrink-0"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
