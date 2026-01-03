import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Users, Calendar, TrendingUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface RiskAlert {
  type: 'critical' | 'warning' | 'info';
  icon: React.ReactNode;
  message: string;
  count?: number;
}

interface RiskAlertsSectionProps {
  overloadedCount: number;
  atRiskProjects: number;
  upcomingGaps: number;
}

export const RiskAlertsSection: React.FC<RiskAlertsSectionProps> = ({
  overloadedCount,
  atRiskProjects,
  upcomingGaps
}) => {
  const alerts: RiskAlert[] = [
    ...(overloadedCount > 0 ? [{
      type: 'critical' as const,
      icon: <Users className="h-4 w-4" />,
      message: `${overloadedCount} team members over 100% capacity`,
      count: overloadedCount
    }] : []),
    ...(atRiskProjects > 0 ? [{
      type: 'warning' as const,
      icon: <AlertTriangle className="h-4 w-4" />,
      message: `${atRiskProjects} projects at risk`,
      count: atRiskProjects
    }] : []),
    ...(upcomingGaps > 0 ? [{
      type: 'warning' as const,
      icon: <Calendar className="h-4 w-4" />,
      message: `Capacity gap in ${upcomingGaps} weeks`,
      count: upcomingGaps
    }] : [])
  ];

  if (alerts.length === 0) {
    return (
      <Card className="rounded-2xl border-border/50 bg-card h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-green-600">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">All Systems Healthy</p>
              <p className="text-xs text-muted-foreground">No critical issues detected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border/50 bg-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          Critical Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              alert.type === 'critical' 
                ? 'bg-red-100 text-red-600' 
                : alert.type === 'warning'
                ? 'bg-orange-100 text-orange-600'
                : 'bg-blue-100 text-blue-600'
            }`}>
              {alert.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{alert.message}</p>
            </div>
            {alert.count && (
              <Badge 
                variant={alert.type === 'critical' ? 'destructive' : 'warning'}
                className="ml-2"
              >
                {alert.count}
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
