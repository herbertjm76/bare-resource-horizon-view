import React, { useState, useMemo } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { TrendingUp, BarChart3, List, Filter, Plus, History, Search, Kanban, GanttChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectPlanningData } from '@/hooks/useProjectPlanningData';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useProjects } from '@/hooks/useProjects';
import { ProjectPlanningList } from '@/components/resource-planning/ProjectPlanningList';
import { PlanningFilterRow } from '@/components/resource-planning/PlanningFilterRow';
import { DemandCapacityChart } from '@/components/resource-planning/DemandCapacityChart';
import { ResourcePlanningControls } from '@/components/resource-planning/ResourcePlanningControls';
import { PlanningAuditLogViewer } from '@/components/resource-planning/PlanningAuditLogViewer';
import { QuickCreateProjectDialog } from '@/components/resource-planning/QuickCreateProjectDialog';
import { PipelineKanbanView } from '@/components/resource-planning/PipelineKanbanView';
import { PipelineTimelineView } from '@/components/resource-planning/PipelineTimelineView';
import { EditProjectDialog } from '@/components/projects/EditProjectDialog';
import { useDemandProjection } from '@/hooks/useDemandProjection';
import { startOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';

const statusOptions = ['Active', 'On Hold', 'Completed', 'Planning'];

const ResourcePlanning: React.FC = () => {
  const { company } = useCompany();
  const [activeTab, setActiveTab] = useState<string>('kanban');
  const [statusFilter, setStatusFilter] = useState<string[]>(['Active', 'Planning']);
  const [showBudget, setShowBudget] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [practiceAreaFilter, setPracticeAreaFilter] = useState<string>('all');
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedWeeks, setSelectedWeeks] = useState<number>(12);
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // For edit dialog
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { 
    projects, 
    officeStages, 
    totals, 
    isLoading: isPlanningLoading,
    refetch 
  } = useProjectPlanningData(statusFilter);

  const { teamMembers, isLoading: isTeamLoading } = useTeamMembersData(true);

  // Fetch departments
  const { data: departments = [] } = useQuery({
    queryKey: ['office-departments', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('office_departments')
        .select('id, name')
        .eq('company_id', company.id)
        .order('name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  // Fetch practice areas
  const { data: practiceAreas = [] } = useQuery({
    queryKey: ['office-practice-areas', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('office_practice_areas')
        .select('id, name')
        .eq('company_id', company.id)
        .order('name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  // For forecast tab
  const { weeklyDemand, roleNames, projectDemands, totalProjectedHours: forecastHours, isLoading: isDemandLoading } = useDemandProjection(
    startDate,
    selectedWeeks
  );

  // Calculate team capacity
  const weeklyCapacity = teamMembers.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0);
  const totalTeamCapacity = weeklyCapacity * selectedWeeks;

  const isLoading = isPlanningLoading || isTeamLoading;

  // Filter projects by search, department, and practice area
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          project.name.toLowerCase().includes(term) ||
          project.code.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // Department filter
      if (departmentFilter !== 'all') {
        if (project.department !== departmentFilter) return false;
      }

      return true;
    });
  }, [projects, searchTerm, departmentFilter]);

  const toggleStatus = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedProject(null);
  };

  return (
    <StandardLayout>
      <OfficeSettingsProvider>
        <StandardizedPageHeader
          title="Project Pipeline"
          description="Track project stages, plan team composition, and forecast resource demand"
          icon={TrendingUp}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Centered Tabs */}
          <div className="flex justify-center py-4 border-b border-border/50 bg-muted/30">
            <TabsList className="inline-flex h-11 items-center justify-center rounded-lg bg-background p-1 shadow-sm border border-border/60">
              <TabsTrigger
                value="kanban"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <Kanban className="h-4 w-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <GanttChart className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger
                value="planning"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <List className="h-4 w-4" />
                Planning
              </TabsTrigger>
              <TabsTrigger
                value="forecast"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <BarChart3 className="h-4 w-4" />
                Forecast
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Kanban Tab */}
          <TabsContent value="kanban" className="mt-0 py-6">
            <div className="px-6 space-y-4">
              {/* Controls */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-9"
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Status
                        {statusFilter.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {statusFilter.length}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-48">
                      <div className="space-y-2">
                        {statusOptions.map(status => (
                          <div key={status} className="flex items-center gap-2">
                            <Checkbox
                              id={`kanban-${status}`}
                              checked={statusFilter.includes(status)}
                              onCheckedChange={() => toggleStatus(status)}
                            />
                            <Label htmlFor={`kanban-${status}`} className="text-sm cursor-pointer">
                              {status}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {filteredProjects.length} projects
                  </p>
                  <Button size="sm" className="gap-2" onClick={() => setShowCreateProject(true)}>
                    <Plus className="h-4 w-4" />
                    New Project
                  </Button>
                </div>
              </div>

              <PipelineKanbanView
                projects={filteredProjects}
                isLoading={isLoading}
                onProjectClick={handleProjectClick}
                onUpdate={refetch}
              />
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="mt-0 py-6">
            <div className="px-6 space-y-4">
              {/* Controls */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-9"
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Status
                        {statusFilter.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {statusFilter.length}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-48">
                      <div className="space-y-2">
                        {statusOptions.map(status => (
                          <div key={status} className="flex items-center gap-2">
                            <Checkbox
                              id={`timeline-${status}`}
                              checked={statusFilter.includes(status)}
                              onCheckedChange={() => toggleStatus(status)}
                            />
                            <Label htmlFor={`timeline-${status}`} className="text-sm cursor-pointer">
                              {status}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  {filteredProjects.length} projects
                </p>
              </div>

              <Card>
                <CardContent className="p-4">
                  <PipelineTimelineView
                    projects={filteredProjects}
                    isLoading={isLoading}
                    onProjectClick={handleProjectClick}
                    weeksToShow={16}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        <TabsContent value="planning" className="mt-0 py-4">
          <div className="px-6 space-y-4">
            {/* Filter Row */}
            <PlanningFilterRow
              departmentFilter={departmentFilter}
              onDepartmentChange={setDepartmentFilter}
              departments={departments}
              statusFilter={statusFilter}
              onStatusToggle={toggleStatus}
              statusOptions={statusOptions}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              projectCount={filteredProjects.length}
              totalProjects={projects.length}
              onCreateProject={() => setShowCreateProject(true)}
              showBudget={showBudget}
              onShowBudgetChange={setShowBudget}
            />

            {/* Project List */}
            <ProjectPlanningList
              projects={filteredProjects}
              officeStages={officeStages}
              isLoading={isLoading}
              showBudget={showBudget}
              onUpdate={refetch}
            />
          </div>
        </TabsContent>

        {/* Demand Forecast Tab */}
        <TabsContent value="forecast" className="mt-0 py-6">
          <div className="px-6 space-y-6">
            {/* Controls */}
            <ResourcePlanningControls
              selectedWeeks={selectedWeeks}
              onWeeksChange={setSelectedWeeks}
              startDate={startDate}
              onStartDateChange={setStartDate}
            />

            {/* Chart */}
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
          </div>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="mt-0 py-6">
          <div className="px-6">
            <PlanningAuditLogViewer />
          </div>
        </TabsContent>
      </Tabs>

        {/* Quick Create Project Dialog */}
        <QuickCreateProjectDialog
          open={showCreateProject}
          onOpenChange={setShowCreateProject}
          onSuccess={refetch}
        />

        {/* Edit Project Dialog */}
        {selectedProject && (
          <EditProjectDialog
            project={selectedProject}
            isOpen={isEditDialogOpen}
            onClose={handleCloseDialog}
            refetch={refetch}
          />
        )}
      </OfficeSettingsProvider>
    </StandardLayout>
  );
};

export default ResourcePlanning;
