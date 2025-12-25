import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { TrendingUp, BarChart3, Users } from 'lucide-react';
import { startOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDemandProjection } from '@/hooks/useDemandProjection';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { Skeleton } from '@/components/ui/skeleton';
import { DemandCapacityChart } from '@/components/resource-planning/DemandCapacityChart';
import { ResourcePlanningControls } from '@/components/resource-planning/ResourcePlanningControls';
import { ResourcePlanningMetrics } from '@/components/resource-planning/ResourcePlanningMetrics';

const ResourcePlanning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('forecast');
  const [selectedWeeks, setSelectedWeeks] = useState<number>(12);
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const { weeklyDemand, roleNames, projectDemands, totalProjectedHours, isLoading: isDemandLoading } = useDemandProjection(
    startDate,
    selectedWeeks
  );
  
  const { teamMembers, isLoading: isTeamLoading } = useTeamMembersData(true);

  // Calculate total team capacity
  const totalTeamCapacity = teamMembers.reduce((sum, member) => {
    return sum + ((member.weekly_capacity || 40) * selectedWeeks);
  }, 0);

  const weeklyCapacity = teamMembers.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0);

  const isLoading = isDemandLoading || isTeamLoading;

  return (
    <StandardLayout>
      <StandardizedPageHeader
        title="Resource Planning"
        description="Forecast resource demand vs capacity based on project team compositions"
        icon={TrendingUp}
      />
      
      <div className="space-y-6">
        {/* Centered Tabs with distinct styling */}
        <div className="flex justify-center py-4 border-b border-border/50 bg-muted/30">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="inline-flex h-11 items-center justify-center rounded-lg bg-background p-1 shadow-sm border border-border/60">
              <TabsTrigger
                value="forecast"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <TrendingUp className="h-4 w-4" />
                Demand Forecast
              </TabsTrigger>
              <TabsTrigger
                value="by-role"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm opacity-60"
                disabled
              >
                <Users className="h-4 w-4" />
                By Role
                <span className="text-xs opacity-70">(Soon)</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forecast" className="mt-6">
              <div className="px-6 space-y-6">
                {/* Controls */}
                <ResourcePlanningControls
                  selectedWeeks={selectedWeeks}
                  onWeeksChange={setSelectedWeeks}
                  startDate={startDate}
                  onStartDateChange={setStartDate}
                />

                {isLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-80 w-full" />
                  </div>
                ) : (
                  <>
                    {/* Metrics Cards */}
                    <ResourcePlanningMetrics
                      totalProjectedHours={totalProjectedHours}
                      totalTeamCapacity={totalTeamCapacity}
                      weeklyCapacity={weeklyCapacity}
                      teamMemberCount={teamMembers.length}
                      selectedWeeks={selectedWeeks}
                      projectCount={new Set(projectDemands.map(d => d.projectId)).size}
                    />

                    {/* Main Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Demand vs Capacity Forecast</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DemandCapacityChart
                          weeklyDemand={weeklyDemand}
                          roleNames={roleNames}
                          weeklyCapacity={weeklyCapacity}
                        />
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="by-role" className="mt-6">
              <div className="flex items-center justify-center h-[500px] border-2 border-dashed border-border rounded-xl bg-muted/20 mx-6">
                <div className="text-center px-6">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Role-Based Planning Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Breakdown of demand by role type with hiring recommendations
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StandardLayout>
  );
};

export default ResourcePlanning;
