import React, { useState, useMemo } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { TrendingUp, BarChart3, List, GanttChart } from 'lucide-react';
import { CenteredTabs, CenteredTabItem, TabsContent } from '@/components/ui/centered-tabs';
import { useProjectPlanningData } from '@/hooks/useProjectPlanningData';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { ProjectPlanningList } from '@/components/resource-planning/ProjectPlanningList';
import { PlanningFilterRow } from '@/components/resource-planning/PlanningFilterRow';
import { DemandCapacityChart } from '@/components/resource-planning/DemandCapacityChart';
import { ResourcePlanningControls } from '@/components/resource-planning/ResourcePlanningControls';
import { PlanningAuditLogViewer } from '@/components/resource-planning/PlanningAuditLogViewer';
import { QuickCreateProjectDialog } from '@/components/resource-planning/QuickCreateProjectDialog';
import { EnhancedTimelineView } from '@/components/resource-planning/EnhancedTimelineView';
import { EditProjectDialog } from '@/components/projects/EditProjectDialog';
import { useDemandProjection } from '@/hooks/useDemandProjection';
import { startOfWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useAppSettings } from '@/hooks/useAppSettings';

const statusOptions = ['Active', 'On Hold', 'Completed', 'Planning'];

const ResourcePlanning: React.FC = () => {
  const { company } = useCompany();
  const { workWeekHours } = useAppSettings();
  const [activeTab, setActiveTab] = useState<string>('planning');
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
  const weeklyCapacity = teamMembers.reduce((sum, member) => sum + (member.weekly_capacity || workWeekHours), 0);
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
        
        <CenteredTabs
          value={activeTab}
          onValueChange={setActiveTab}
          tabs={[
            { value: 'planning', label: 'Planning', icon: List },
            { value: 'timeline', label: 'Timeline', icon: GanttChart },
            { value: 'forecast', label: 'Forecast', icon: BarChart3 },
          ]}
        >
          {/* Timeline Tab */}
          <TabsContent value="timeline" className="mt-0 py-4">
            <div className="px-6 space-y-4">
              {/* Consistent Filter Row */}
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

              <Card>
                <CardContent className="p-4">
                  <EnhancedTimelineView
                    projects={filteredProjects}
                    isLoading={isLoading}
                    onProjectClick={handleProjectClick}
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
                  <CardTitle className="text-lg">Project Demand Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <DemandCapacityChart
                    weeklyDemand={weeklyDemand}
                    roleNames={roleNames}
                    weeklyCapacity={weeklyCapacity}
                    projectDemands={projectDemands}
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
        </CenteredTabs>

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
