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
      <Card className="border-0 bg-gradient-to-br from-purple-1 to-white/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-1/80 to-white/20"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Available This Month</CardTitle>
          <UserCheck className="h-5 w-5 text-gray-600" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold text-gray-800 mb-1">{availableThisMonth.count}</div>
          <p className="text-xs text-gray-600 mb-3">
            {availableThisMonth.totalHours}h available capacity
          </p>
          <div className="flex flex-wrap gap-1">
            {availableThisMonth.members.slice(0, 3).map((member, i) => (
              <Badge key={i} variant="secondary" className="text-xs bg-white/30 text-gray-700 border-white/40">
                {member.name}
              </Badge>
            ))}
            {availableThisMonth.members.length > 3 && (
              <Badge variant="outline" className="text-xs bg-white/20 text-gray-700 border-white/40">
                +{availableThisMonth.members.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Multi-Project Load */}
      <Card className="border-0 bg-gradient-to-br from-purple-2 to-purple-2/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-2/90 to-purple-2/60"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Multi-Project Load</CardTitle>
          <Users className="h-5 w-5 text-white" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold text-white mb-1">{multiProjectLoad.count}</div>
          <p className="text-xs text-white/80 mb-3">
            Resources across {multiProjectLoad.totalProjects} projects
          </p>
          <div className="flex flex-wrap gap-1">
            {multiProjectLoad.resources.slice(0, 3).map((resource, i) => (
              <Badge key={i} variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                {resource.name} ({resource.projectCount}p)
              </Badge>
            ))}
            {multiProjectLoad.resources.length > 3 && (
              <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/30">
                +{multiProjectLoad.resources.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overloaded Resources */}
      <Card className="border-0 bg-gradient-to-br from-purple-3 to-purple-3/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-3/90 to-purple-3/60"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Overloaded Resources</CardTitle>
          <AlertTriangle className="h-5 w-5 text-white" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold text-white mb-1">{overloadedResources.count}</div>
          <p className="text-xs text-white/80 mb-3">
            {overloadedResources.totalOverloadDays} days over capacity
          </p>
          <div className="space-y-1">
            {overloadedResources.resources.slice(0, 2).map((resource, i) => (
              <div key={i} className="text-xs">
                <span className="font-medium text-white">{resource.name}</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {resource.overloadDays.slice(0, 3).map((day, j) => (
                    <Badge key={j} variant="destructive" className="text-xs px-1 py-0 bg-red-500/20 text-white border-red-400/30">
                      {day}
                    </Badge>
                  ))}
                  {resource.overloadDays.length > 3 && (
                    <Badge variant="outline" className="text-xs px-1 py-0 bg-white/10 text-white border-white/30">
                      +{resource.overloadDays.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {overloadedResources.resources.length > 2 && (
              <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/30">
                +{overloadedResources.resources.length - 2} more overloaded
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resource Conflicts */}
      <Card className="border-0 bg-gradient-to-br from-purple-4 to-purple-4/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-4/90 to-purple-4/60"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Resource Conflicts</CardTitle>
          <Clock className="h-5 w-5 text-white" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold text-white mb-1">{resourceConflicts.count}</div>
          <p className="text-xs text-white/80 mb-3">
            Scheduling conflicts detected
          </p>
          <div className="flex flex-wrap gap-1">
            {resourceConflicts.conflicts.slice(0, 3).map((conflict, i) => (
              <Badge key={i} variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                {conflict.resourceName}
              </Badge>
            ))}
            {resourceConflicts.conflicts.length > 3 && (
              <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/30">
                +{resourceConflicts.conflicts.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};