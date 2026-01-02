import React, { useState, useMemo } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { TrendingUp, List, GanttChart } from 'lucide-react';
import { CenteredTabs, TabsContent } from '@/components/ui/centered-tabs';
import { useProjectPlanningData } from '@/hooks/useProjectPlanningData';
import { ProjectPlanningList } from '@/components/resource-planning/ProjectPlanningList';
import { PlanningFilterRow } from '@/components/resource-planning/PlanningFilterRow';
import { QuickCreateProjectDialog } from '@/components/resource-planning/QuickCreateProjectDialog';
import { PipelineTimelineView } from '@/components/resource-planning/PipelineTimelineView';
import { EditProjectDialog } from '@/components/projects/EditProjectDialog';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_DEPARTMENTS, DEMO_PRACTICE_AREAS } from '@/data/demoData';

const statusOptions = ['Active', 'On Hold', 'Completed', 'Planning'];

const ResourcePlanning: React.FC = () => {
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();
  const [activeTab, setActiveTab] = useState<string>('planning');
  const [statusFilter, setStatusFilter] = useState<string[]>(['Active', 'Planning']);
  const [showBudget, setShowBudget] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showCreateProject, setShowCreateProject] = useState(false);
  
  // For edit dialog
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editDialogTab, setEditDialogTab] = useState<"info" | "team">("info");

  const { 
    projects, 
    officeStages, 
    isLoading,
    refetch 
  } = useProjectPlanningData(statusFilter);

  // Fetch departments
  const { data: departments = [] } = useQuery({
    queryKey: ['office-departments', company?.id, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_DEPARTMENTS.map(d => ({ id: d.id, name: d.name }));
      }
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('office_departments')
        .select('id, name')
        .eq('company_id', company.id)
        .order('name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id || isDemoMode
  });

  // Fetch practice areas
  const { data: practiceAreas = [] } = useQuery({
    queryKey: ['office-practice-areas', company?.id, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_PRACTICE_AREAS.map(p => ({ id: p.id, name: p.name }));
      }
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('office_practice_areas')
        .select('id, name')
        .eq('company_id', company.id)
        .order('name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id || isDemoMode
  });

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

  const handleProjectClick = (project: any, tab: "info" | "team" = "info") => {
    setSelectedProject(project);
    setEditDialogTab(tab);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedProject(null);
    setEditDialogTab("info");
  };

  return (
    <StandardLayout>
      <OfficeSettingsProvider>
        <StandardizedPageHeader
          title="Project Pipeline"
          description="Track project stages, plan team composition, and manage timelines"
          icon={TrendingUp}
        />
        
        <CenteredTabs
          value={activeTab}
          onValueChange={setActiveTab}
          tabs={[
            { value: 'planning', label: 'Planning', icon: List },
            { value: 'timeline', label: 'Timeline', icon: GanttChart },
          ]}
        >
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
                  <PipelineTimelineView
                    projects={filteredProjects}
                    isLoading={isLoading}
                    onProjectClick={handleProjectClick}
                    departments={departments}
                    practiceAreas={practiceAreas}
                  />
                </CardContent>
              </Card>
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
            initialTab={editDialogTab}
          />
        )}
      </OfficeSettingsProvider>
    </StandardLayout>
  );
};

export default ResourcePlanning;
