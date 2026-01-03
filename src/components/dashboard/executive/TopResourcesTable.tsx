import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ResourceData {
  id: string;
  name: string;
  avatarUrl?: string;
  thisWeek: number;
  nextWeek: number;
  projectCount: number;
}

interface TopResourcesTableProps {
  resources: ResourceData[];
  title?: string;
}

export const TopResourcesTable: React.FC<TopResourcesTableProps> = ({
  resources,
  title = "Most Overloaded Resources"
}) => {
  const getUtilizationBadge = (utilization: number) => {
    if (utilization > 120) return { variant: 'destructive' as const, label: 'Critical' };
    if (utilization > 100) return { variant: 'warning' as const, label: 'High' };
    return { variant: 'default' as const, label: 'Normal' };
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="rounded-2xl border-border/50 bg-card h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No overloaded resources found
            </p>
          ) : (
            resources.slice(0, 5).map((resource) => {
              const badge = getUtilizationBadge(resource.thisWeek);
              
              return (
                <div
                  key={resource.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={resource.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {getInitials(resource.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {resource.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {resource.projectCount} {resource.projectCount === 1 ? 'project' : 'projects'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {resource.thisWeek}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {resource.nextWeek}% next
                      </p>
                    </div>
                    <Badge variant={badge.variant} className="text-xs">
                      {badge.label}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
