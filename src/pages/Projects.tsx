
import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useProjects } from '@/hooks/useProjects';
import { ProjectSetupWizard } from '@/components/projects/enhanced-wizard/ProjectSetupWizard';
import { SimpleBreadcrumbs } from '@/components/navigation/SimpleBreadcrumbs';
import { ProjectsHeader } from '@/components/projects/ProjectsHeader';
import { ProjectExecutiveSummary } from '@/pages/Projects/components/ProjectExecutiveSummary';
import { QuickStatusManager } from '@/components/projects/QuickStatusManager';
import { ListChecks } from 'lucide-react';

const Projects = () => {
  const { projects, refetch } = useProjects();
  const [showWizard, setShowWizard] = useState(false);
  const [showStatusManager, setShowStatusManager] = useState(false);

  // Calculate statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(project => 
    project.status === 'In Progress'
  ).length;
  const completedProjects = projects.filter(project => 
    project.status === 'Complete'
  ).length;
  const totalOffices = new Set(projects.map(project => project.office?.name).filter(Boolean)).size;

  // Calculate completion rate
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  const handleWizardSubmit = async (data: any) => {
    console.log('Project wizard data:', data);
    // TODO: Implement project creation logic
    setShowWizard(false);
    refetch();
  };

  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <SimpleBreadcrumbs />
        
        <ProjectsHeader onNewProject={() => setShowWizard(true)} />

        <ProjectExecutiveSummary
          totalProjects={totalProjects}
          activeProjects={activeProjects}
          completionRate={completionRate}
          totalOffices={totalOffices}
        />
        
        <OfficeSettingsProvider>
          <ProjectsList />
          
          {/* Floating Status Management Button */}
          <Button
            onClick={() => setShowStatusManager(true)}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            size="icon"
            title="Manage Project Statuses"
          >
            <ListChecks className="h-6 w-6" />
          </Button>

          <QuickStatusManager
            open={showStatusManager}
            onOpenChange={setShowStatusManager}
          />
        </OfficeSettingsProvider>

        <Dialog open={showWizard} onOpenChange={setShowWizard}>
          <ProjectSetupWizard
            onSubmit={handleWizardSubmit}
            onCancel={() => setShowWizard(false)}
          />
        </Dialog>
      </div>
    </StandardLayout>
  );
};

export default Projects;
