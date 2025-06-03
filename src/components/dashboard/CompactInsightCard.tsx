
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

const getSeverityCardStyle = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-gradient-to-r from-red-50 to-red-100 border-[3px] border-red-200';
    case 'high': return 'bg-gradient-to-r from-orange-50 to-orange-100 border-[3px] border-orange-200';
    case 'medium': return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-[3px] border-yellow-200';
    case 'low': return 'bg-gradient-to-r from-blue-50 to-blue-100 border-[3px] border-blue-200';
    default: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-[3px] border-gray-200';
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
    
    if (typeof icon === 'object' && icon !== null && 'name' in icon) {
      const IconComponent = iconMap[icon.name as keyof typeof iconMap] || TrendingUp;
      return <IconComponent className={icon.className} />;
    }
    
    return <TrendingUp className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card className={`${getSeverityCardStyle(severity)} rounded-xl p-6 shadow-sm border-l-4 transition-all hover:shadow-md`}>
      <CardContent className="p-0">
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
