import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, AlertTriangle, Clock } from 'lucide-react';
import { useProjectResourcingSummary } from '../hooks/useProjectResourcingSummary';

interface ProjectResourcingSummaryCardsProps {
  selectedMonth: Date;
  periodToShow: number;
}

export const ProjectResourcingSummaryCards: React.FC<ProjectResourcingSummaryCardsProps> = ({
  selectedMonth,
  periodToShow
}) => {
  const { 
    availableThisMonth,
    multiProjectLoad, 
    overloadedResources,
    resourceConflicts,
    isLoading 
  } = useProjectResourcingSummary(selectedMonth, periodToShow);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* Available This Month */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available This Month</CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{availableThisMonth.count}</div>
          <p className="text-xs text-muted-foreground">
            {availableThisMonth.totalHours}h available capacity
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {availableThisMonth.members.slice(0, 3).map((member, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {member.name}
              </Badge>
            ))}
            {availableThisMonth.members.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{availableThisMonth.members.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Multi-Project Load */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Multi-Project Load</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{multiProjectLoad.count}</div>
          <p className="text-xs text-muted-foreground">
            Resources across {multiProjectLoad.totalProjects} projects
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {multiProjectLoad.resources.slice(0, 3).map((resource, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {resource.name} ({resource.projectCount}p)
              </Badge>
            ))}
            {multiProjectLoad.resources.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{multiProjectLoad.resources.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overloaded Resources */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overloaded Resources</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{overloadedResources.count}</div>
          <p className="text-xs text-muted-foreground">
            {overloadedResources.totalOverloadDays} days over capacity
          </p>
          <div className="space-y-1 mt-2">
            {overloadedResources.resources.slice(0, 2).map((resource, i) => (
              <div key={i} className="text-xs">
                <span className="font-medium">{resource.name}</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {resource.overloadDays.slice(0, 3).map((day, j) => (
                    <Badge key={j} variant="destructive" className="text-xs px-1 py-0">
                      {day}
                    </Badge>
                  ))}
                  {resource.overloadDays.length > 3 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{resource.overloadDays.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {overloadedResources.resources.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{overloadedResources.resources.length - 2} more overloaded
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resource Conflicts This Week */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resource Conflicts</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{resourceConflicts.count}</div>
          <p className="text-xs text-muted-foreground">
            Scheduling conflicts detected
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {resourceConflicts.conflicts.slice(0, 3).map((conflict, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {conflict.resourceName}
              </Badge>
            ))}
            {resourceConflicts.conflicts.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{resourceConflicts.conflicts.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};